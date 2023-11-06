
import { Router } from 'express';
import { check } from 'express-validator';
import { getUsuario, getUsuarios, CrearUsuario, putUsuario, deleteUsuario, getAllUsuarios } from '../controllers/usuario'
import validarCampos from '../middlewares/validar-campos';

const router = Router();

router.get('/', 
getUsuarios );

router.get('/all', getAllUsuarios);

router.get('/:id', 
getUsuario );

router.post(
    '/',   
    [

      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
      check('email', 'El correo es obligatorio').isEmail(),

      check('telefono', 'El teléfono es obligatorio').not().isEmpty(),
      check('direccion', 'La dirección es obligatoria').not().isEmpty(),
      validarCampos.instance.validarCampos
    ],
    CrearUsuario
  );

  router.put('/:id', 
  [

  ], 
putUsuario
);

router.delete('/:id', deleteUsuario );

export default router;