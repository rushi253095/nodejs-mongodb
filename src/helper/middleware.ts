import responseConstants from "../constants/responseConstants";

class Middleware {
    constructor() { }

    public routeError = (req, res) => {
        return res.status(responseConstants.ERROR400.CODE).json({
            message: req.t("ROUTE_ERROR"),
        });
    }
}

export default new Middleware();
