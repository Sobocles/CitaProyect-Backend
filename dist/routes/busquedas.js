"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const busquedas_1 = require("../controllers/busquedas");
const router = (0, express_1.Router)();
router.get('/:busqueda', busquedas_1.getTodo);
exports.default = router;
//# sourceMappingURL=busquedas.js.map