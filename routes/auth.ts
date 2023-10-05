const { Router } = require('express');
import { check } from 'express-validator';
import { login } from '../controllers/auth';
import validarCampos from '../middlewares/validar-campos';
import validarJWT from '../middlewares/validar-jwt';
import { renewToken } from '../controllers/auth';

const router = Router();

router.post('/',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos.instance.validarCampos
],login );

router.get( '/renew',
    validarJWT,
    renewToken
)

export default router;
