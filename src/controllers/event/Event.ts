import { Request, Response } from "express";
import Event from "../../model/Event";
import { IEvent } from "../../types/event";
import {
  uploadImageToFirebase,
  uploadMusicToFirebase,
} from "../../util/uploadImageToFirebase";
import Stripe from "stripe";
import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("Stripe secret key not found");
// }
const stripe_test = new Stripe(process.env.STRIPE_TEST_KEY as string);
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

class EventController {
  public async createEvent(req: Request, res: Response) {
    try {
      const { title, description, location, date }: IEvent = req.body;
      const searchEvent = await Event.findOne({ title });

      if (searchEvent) {
        return res.status(400).send({ message: "Event already exists" });
      }

      const pictureFromFirebase = await uploadImageToFirebase(req, res);

      const saveEvent = new Event({
        title,
        description,
        location,
        date,
        picture: pictureFromFirebase,
      });

      await saveEvent.save();

      return res.status(200).send({ message: "Event successfully created!" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async getEvent(req: Request, res: Response) {
    try {
      const events = await Event.find();

      return res.status(200).send(events);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async getEventById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const event = await Event.findById(id);

      return res.status(200).send(event);
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async updateEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, location, date, picture }: IEvent = req.body;

      const pictureFromFirebase = uploadImageToFirebase(req, res);

      await Event.findByIdAndUpdate(id, {
        title,
        description,
        location,
        date,
        picture: pictureFromFirebase,
      });

      return res.status(200).send({ message: "Event successfully updated!" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async deleteEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await Event.findByIdAndDelete(id);

      return res.status(200).send({ message: "Event successfully deleted!" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "Internal server error" });
    }
  }

  public async createCheckoutSession(req: Request, res: Response) {
    const { title, description, price, email, location, date, colors }: any =
      req.body;

    if (!title || !description || !price || !location || !email || !date) {
      return res.status(400).send({ message: "Missing required fields" });
    }

    if (title && description && price && location && date && email) {
      const searchEvent = await Event.findOne({ title });
      if (searchEvent) {
        return res.status(400).send({ message: "Event already exists" });
      }
    }
    const pictureFromFirebase = await uploadImageToFirebase(req, res);
    const musicFromFirebase = await uploadMusicToFirebase(req, res);
    try {
      const session = await stripe_test.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "brl",
              product_data: {
                name: title,
                description: description,
              },
              unit_amount: Math.round(price * 100), // O valor em centavos
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          title,
          description,
          price: price?.toString(),
          location,
          date,
          email,
          colors,
          picture: pictureFromFirebase,
          music: musicFromFirebase,
        },
        success_url: `http://localhost:3001/success`,
        cancel_url: `http://localhost:3001/cancel`,
      } as Stripe.Checkout.SessionCreateParams);

      return res.status(200).send({ id: session.id });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  public async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.WEBHOOK_LOCAL_SECRET;
    if (!endpointSecret) {
      throw new Error("⚠️  Webhook secret missing");
    }
    let event;

    try {
      if (!sig) {
        throw new Error("⚠️  Webhook signature missing.");
      }
      event = stripe_test.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.metadata) {
        const {
          title,
          description,
          price,
          email,
          colors,
          location,
          date,
          picture,
          music,
        } = session.metadata;

        if (title && description && date) {
          const searchEvent = await Event.findOne({ title });
          if (searchEvent) {
            return res.status(400).send({ message: "Event already exists" });
          }

          const newEvent = new Event({
            title,
            description,
            price,
            location,
            date,
            picture,
            music,
            colors: JSON.parse(colors),
          });

          const event = await newEvent.save();

          const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
              user: process.env.GMAIL_USER,
              pass: process.env.GMAIL_PASS,
            },
          });

          const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Seu evento foi criado com sucesso!",
            text: `Olá,\n\nSeu evento "${title}" foi criado com sucesso!
            \nDetalhes do evento:
            \n\nDescrição: ${description}
            \nData: ${date}
            \nLocal: ${location}
            \nPreço: R$ ${price}
            \nSite: http://localhost:3001/event/${event._id}
            \n\nAtenciosamente,
            \nTime2Event`,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error("Erro ao enviar e-mail:", error);
            } else {
              console.log("E-mail enviado:", info.response);
            }
          });

          return res
            .status(200)
            .send({ message: "Event successfully created!" });
        } else {
          return res
            .status(400)
            .send({ message: "Missing event metadata fields" });
        }
      } else {
        return res
          .status(400)
          .send({ message: "No metadata found in session" });
      }
    }

    return res.send({ received: true });
  }
}

export default new EventController();
