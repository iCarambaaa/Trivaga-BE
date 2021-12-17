import express from "express";
import AccomodationSchema from "../model/accomodation";
import DestinationSchema from "../model/accomodation";
import { RoleCheckMiddleware } from "../auth/roleCheck";
import { JWTAuthMiddleware } from "../auth/token";

const AccRouter = express.Router();

AccRouter.route("/")
  .get(async (req, res) => {
    try {
      const accommodations = await AccomodationSchema.find({}).populate({
        path: "city",
      });
      if (accommodations) {
        res.status(200).send(accommodations);
      } else {
        res.status(404).send({ message: "Accomodation not found" });
      }
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    try {
      const accommodation = new AccomodationSchema(req.body);
      if (accommodation) {
        await accommodation.save();
        res.status(201).send(accommodation);
      } else {
        res.status(404).send({ message: "Accomodation not found" });
      }
    } catch (error) {
      console.log(error);
    }
  });

AccRouter.route("/:id")
  .get(async (req, res) => {
    try {
      const id = req.params.id;
      const accomodation = await AccomodationSchema.findById(id);
      if (accomodation) {
        res.send(accomodation);
      } else {
        res.status(404).send({ message: "Accomodation with ${id} not found" });
      }
    } catch (error) {
      console.log(error);
    }
  })
  .put(async (req, res) => {
    try {
      const id = req.params.id;
      const updatedAccomodation = await AccomodationSchema.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      );
      if (updatedAccomodation) {
        res.status(203).send(updatedAccomodation);
      } else {
        res.status(404).send({ message: "Accomodation with ${id} not found" });
      }
    } catch (error) {
      console.log(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await AccomodationSchema.findByIdAndDelete(id);
      if (deleted) {
        res.status(204).send({});
      } else {
        res.status(404).send({ message: "Accomodation with ${id} not found" });
      }
    } catch (error) {
      console.log(error);
    }
  });

export default AccRouter;
