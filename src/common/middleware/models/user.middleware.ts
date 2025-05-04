import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../../models/users/users.service';
import { CURRENT_USER_KEY } from '../../constants/settings';

/**
 * Middleware para cargar datos del usuario actual en la solicitud
 *
 * Este middleware extrae el ID de usuario del token JWT y carga
 * los datos completos del usuario desde la base de datos
 */
@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Verificar si existe un usuario autenticado en la solicitud
      if (req['user'] && req['user'].id) {
        const userId = req['user'].id;

        // Cargar datos completos del usuario desde la base de datos
        const user = await this.usersService.findById(userId);

        // Almacenar el usuario en la solicitud para su uso posterior
        req[CURRENT_USER_KEY] = user;
      }
    } catch (error) {
      // Si hay un error, continuamos sin establecer el usuario
      console.error('Error en UserMiddleware:', error.message);
    }

    // Continuar con el siguiente middleware o controlador
    next();
  }
}
