import { asyncHandler } from "../utils/asyncHandler.js";

const sendList = (res, r) => res.json({ success: true, data: r.data, total: r.total, page: r.page, limit: r.limit });
const sendOne = (res, r) => (r === null ? res.status(404).json({ success: false, message: "Not found" }) : res.json({ success: true, data: r.data }));
const sendCreated = (res, r) => res.status(201).json({ success: true, data: r.data });
const sendRemoved = (res, ok) => (ok ? res.json({ success: true, message: "Deleted" }) : res.status(404).json({ success: false, message: "Not found" }));

export const crudController = (service, S) => ({
  [`list${S}`]: asyncHandler(async (req, res, next) => { try { return sendList(res, await service.list(req.query)); } catch (e) { next(e); } }),
  [`get${S}ById`]: asyncHandler(async (req, res, next) => { try { return sendOne(res, await service.getById(req.params.id)); } catch (e) { next(e); } }),
  [`create${S}`]: asyncHandler(async (req, res, next) => { try { return sendCreated(res, await service.create(req.body)); } catch (e) { next(e); } }),
  [`update${S}`]: asyncHandler(async (req, res, next) => { try { return sendOne(res, await service.update(req.params.id, req.body)); } catch (e) { next(e); } }),
  [`delete${S}`]: asyncHandler(async (req, res, next) => { try { return sendRemoved(res, await service.remove(req.params.id)); } catch (e) { next(e); } })
});
