import { Request, Response } from 'express';

import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import JwtGenerate from '../helpers/jwt';

import Factura from '../models/factura';
import CitaMedica from '../models/cita_medica';
import Usuario from '../models/usuario';
import Medico from '../models/medico';

export async function getAllFacturas(req: Request, res: Response) {
    try {
        const facturas = await Factura.findAll({
            include: [{
                model: CitaMedica,
                as: 'citaMedica',
                include: [
                    {
                        model: Usuario,
                        as: 'paciente',
                        attributes: ['rut', 'nombre', 'apellidos']
                    },
                    {
                        model: Medico,
                        as: 'medico',
                        attributes: ['rut', 'nombre', 'apellidos']
                    }
                ],
                attributes: ['motivo']
            }],
            attributes: ['id_factura', 'payment_method_id', 'transaction_amount', 'monto_pagado'] // Incluye 'id_factura' aquí
        });

        if (!facturas || facturas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron facturas' });
        }

        const facturaInfo = facturas.map(factura => ({
            idFactura: factura.id_factura, // Agrega esta línea
            rutPaciente: factura.citaMedica?.paciente?.rut,
            nombrePaciente: factura.citaMedica?.paciente?.nombre,
            apellidosPaciente: factura.citaMedica?.paciente?.apellidos,
            motivoCita: factura.citaMedica?.motivo,
            rutMedico: factura.citaMedica?.medico?.rut,
            nombreMedico: factura.citaMedica?.medico?.nombre,
            apellidosMedico: factura.citaMedica?.medico?.apellidos,
            paymentMethodId: factura.payment_method_id,
            transactionAmount: factura.transaction_amount,
            montoPagado: factura.monto_pagado
        }));

        res.status(200).json(facturaInfo);
    } catch (error) {
        console.error('Error al obtener las facturas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}



