// Controlador genérico de catálogo: list/get públicos, create/update/delete admin.
const { pick } = require("../middleware/validateRequest");
const { ResourceNotFoundError } = require("../utils/errors");

module.exports = function makeCatalogController({ service, toDTO, key, label, fields }) {
  const send = (res, status, row) => {
    const dto = toDTO(row);
    res.status(status).json({ [key]: dto, ...dto });
  };
  return {
    list: async (req, res) => {
      const rows = await service.list(req.listWhere);
      res.status(200).json(rows.map(toDTO));
    },
    get: async (req, res) => {
      const row = await service.get(req.params.id);
      if (!row) throw new ResourceNotFoundError(`${label} not found`);
      send(res, 200, row);
    },
    create: async (req, res) => send(res, 201, await service.create(pick(req.body, fields))),
    update: async (req, res) => send(res, 200, await service.update(req.params.id, pick(req.body, fields))),
    remove: async (req, res) => send(res, 200, await service.remove(req.params.id)),
  };
};
