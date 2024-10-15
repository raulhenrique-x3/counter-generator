import { Response, NextFunction } from "express";
import { match } from "path-to-regexp";
import { RequestWithUserRole } from "./Jwt";
import { permissions } from "../../util/permissions";
import User from "../../model/User";

type PermissionKeys = keyof typeof permissions;

export const checkPermission = async (
  req: RequestWithUserRole,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req?.user?.id);
    const userPermissions: any[] = user?.permissions || [];

    const currentRoute = req?.route?.path;

    const permissionKey = (Object.keys(permissions) as PermissionKeys[]).find(
      (route) => {
        const matcher = match(route);
        return matcher(currentRoute);
      }
    );

    if (!permissionKey) {
      return res.status(404).json({ message: "Rota não encontrada" });
    }

    const requiredPermission = permissions[permissionKey].name;

    const hasPermission = userPermissions.some(
      (perm: { name: string }) => perm.name === requiredPermission
    );

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "Acesso negado: Permissão insuficiente" });
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar permissões: ", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
};
