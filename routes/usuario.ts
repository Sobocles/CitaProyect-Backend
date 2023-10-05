
import { Router } from 'express';
import { check } from 'express-validator';
import { getUsuario, getUsuarios, CrearUsuario, putUsuario, deleteUsuario } from '../controllers/usuario'
import validarCampos from '../middlewares/validar-campos';

const router = Router();

router.get('/', getUsuarios );

router.get('/:id', getUsuario );

router.post(
    '/',
    [

      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
      check('email', 'El correo es obligatorio').isEmail(),
      check('password', 'La contraseña es obligatoria y debe tener al menos 6 caracteres').isLength({ min: 6 }),
      check('fecha_nacimiento', 'Fecha de nacimiento inválida').isISO8601(),
      check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
      check('direccion', 'La dirección es obligatoria').not().isEmpty(),
      validarCampos.instance.validarCampos
    ],
    CrearUsuario
  );

router.put('/:id', putUsuario );

router.delete('/:id', deleteUsuario );

export default router;