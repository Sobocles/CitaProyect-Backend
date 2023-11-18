import { Router } from 'express';
import CitaMedica from '../controllers/cita_medica';

import validarCampos from '../middlewares/validar-campos';
import ValidarJwt from '../middlewares/validar-jwt';


const router = Router();

router.get('/',[

    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitas );

router.get('/:idCita', [
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitaFactura );

router.get('/medico/:rut_medico', [
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], CitaMedica.instance.getCitasMedico );


router.post('/', [
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], CitaMedica.instance.crearCita );

router.post('/crearCitapaciente', [
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
], CitaMedica.instance.crearCitaPaciente );

router.put('/:id',
    [
        ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
    ], CitaMedica.instance.putCita
    
 );

router.delete('/:id',[
    ValidarJwt.instance.validarJwt,
    validarCampos.instance.validarCampos
    ], CitaMedica.instance.deleteCita

 );

 export default router;
