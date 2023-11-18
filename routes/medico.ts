
import { Router } from 'express';
import validarCampos from '../middlewares/validar-campos';
import Medicos from '../controllers/medico';
import { check } from 'express-validator';
import Medico from '../models/medico';
import ValidarJwt from '../middlewares/validar-jwt';

const router = Router();

router.get('/',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], Medicos.instance.getMedicos);

router.get('/Especialidades',[

  ValidarJwt.instance.validarJwt,
  validarCampos.instance.validarCampos
], Medicos.instance.getMedicosEspecialidad);

router.get('/all',[
  ValidarJwt.instance.validarJwt,
  validarCampos.instance.validarCampos
], Medicos.instance.getAllMedicos);


router.get('/:id', [
  ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], Medicos.instance.getMedico );


router.post(
    '/',
    [
      // Agrega las validaciones para cada campo del médico aquí
      check('nombre', 'El nombre es obligatorio').not().isEmpty(),
      check('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
      check('email', 'El email es obligatorio').isEmail(),
      check('direccion', 'La dirección es obligatoria').not().isEmpty(),
      // Agrega más validaciones según tus necesidades
      validarCampos.instance.validarCampos,
    ],
    Medicos.instance.CrearMedico
  );

router.put('/:rut',
    [
     
    validarCampos.instance.validarCampos
    ], 
Medicos.instance.putMedico
 );

 router.delete('/:rut',
 
 [
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
  ], 
Medicos.instance.deleteMedico,
);



export default router;
