"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usuario_1 = require("../controllers/usuario");
const validar_campos_1 = __importDefault(require("../middlewares/validar-campos"));
const validar_jwt_1 = __importDefault(require("../middlewares/validar-jwt"));
const router = (0, express_1.Router)();
router.get('/', validar_jwt_1.default.instance.validarJwt, usuario_1.getUsuarios);
router.get('/all', validar_jwt_1.default.instance.validarJwt, usuario_1.getAllUsuarios);
router.get('/allCurso', validar_jwt_1.default.instance.validarJwt, usuario_1.getPacientesConCitasPagadasYEnCurso);
router.get('/:id', validar_jwt_1.default.instance.validarJwt, usuario_1.getUsuario);
router.post('/', [
    validar_jwt_1.default.instance.validarJwt,
    (0, express_validator_1.check)('nombre', 'El nombre es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('apellidos', 'Los apellidos son obligatorios').not().isEmpty(),
    (0, express_validator_1.check)('email', 'El correo es obligatorio').isEmail(),
    (0, express_validator_1.check)('telefono', 'El teléfono es obligatorio').not().isEmpty(),
    (0, express_validator_1.check)('direccion', 'La dirección es obligatoria').not().isEmpty(),
    validar_campos_1.default.instance.validarCampos
], usuario_1.CrearUsuario);
router.put('/:id', [], usuario_1.putUsuario);
router.delete('/:id', validar_jwt_1.default.instance.validarJwt, usuario_1.deleteUsuario);
exports.default = router;
//# sourceMappingURL=usuario.js.map