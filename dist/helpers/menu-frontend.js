"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMenuFrontEnd = void 0;
const getMenuFrontEnd = (rol = 'USER_ROLE') => {
    const adminMenu = [
        { label: 'Gestionar Pacientes', url: '/gestionar-pacientes' },
        { label: 'Gestionar Médicos', url: '/gestionar-medicos' },
        { label: 'Gestionar Horarios de Médicos', url: '/gestionar-horarios-medicos' },
        { label: 'Gestionar Citas', url: '/gestionar-cita' },
        { label: 'Gestionar Tipo de Cita', url: '/gestionar-tipo-cita' },
    ];
    const pacienteMenu = [
        { label: 'Agendar Cita', url: '/Agendar-cita' },
        { label: 'historial', url: '/historial' }
    ];
    const medicoMenu = [
        { label: 'Gestionar Historiales', url: '/gestionar-historiales' },
    ];
    let menuItems = [];
    if (rol === 'ADMIN_ROLE') {
        menuItems = adminMenu;
    }
    else if (rol === 'USER_ROLE') {
        menuItems = pacienteMenu;
    }
    else if (rol === 'MEDICO_ROLE') { // Agregada condición para el rol de médico
        menuItems = medicoMenu;
    }
    else {
        // Manejar otros roles si es necesario
        menuItems = [];
    }
    return menuItems; // Devuelve el menú como resultado en lugar de enviarlo como respuesta JSON
};
exports.getMenuFrontEnd = getMenuFrontEnd;
//# sourceMappingURL=menu-frontend.js.map