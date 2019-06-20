import { Router } from "express";
import airtable from "../airtable";

const api = () => {
  const router = Router();

  // Replace the entire board every time the users modifies it in any way.
  // This solution sends more data than necessary, but cuts down on code and
  // effectively prevents the db and client from ever getting out of sync
  router.post("/card", (req, res) => {
    const board = req.body;
    airtable.addCardData(board).then(response => {
      return res.json({success: true, data: response});
    }).catch(error => {
      return res.json({success: false, message: error});
    });
  });

  router.put("/card", (req, res) => {
    const {cardId, board} = req.body;
    airtable.updateCardData(cardId, board).then(response => {
      return res.json({success: true, data: response});
    }).catch(error => {
      return res.json({success: false, message: error});
    });
  });

  router.delete("/card/:cardId", (req, res) => {
    const { cardId } = req.params;
    airtable.deleteCardData(cardId).then(response => {
      return res.json({success: true, data: response.id});
    }).catch(error => {
      return res.json({success: false, message: error});
    });
  });

  return router;
};

export default api;
