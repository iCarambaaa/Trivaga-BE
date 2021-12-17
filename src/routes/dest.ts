import express, { Request, Response } from "express";
import AccomodationSchema from "../model/accomodation";
import DestinationSchema from "../model/destination";
import mongoose from "mongoose";

const DesRouter = express.Router();

DesRouter.route("/")
  .post(async (req: Request, res: Response) => {
    try {
      const alreadyHere = await DestinationSchema.find({});
      console.log(alreadyHere);
      const foundCity = alreadyHere.find(
        (destination) => destination.city === req.body.city
      );

      if (foundCity) {
        res.status(400).send({ message: "City already there" });
      } else {
        const destination = new DestinationSchema(req.body);
        if (destination) {
          await destination.save();
          res.status(201).send(destination);
        } else {
          res.status(404).send({ message: "destination not found" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  })
  .get(async (req: Request, res: Response) => {
    try {
      //const destinations = await DestinationSchema.find().distinct("city");
      //const destinations = await DestinationSchema.distinct("city");
      const destinations = await DestinationSchema.find({});
      if (destinations) {
        res.status(200).send(destinations);
      } else {
        res.status(404).send({ message: "Accomodation not found" });
      }
    } catch (error) {
      console.log(error);
    }
  });

DesRouter.route("/:cityId").get(async (req: Request, res: Response) => {
  try {
    const accomodations = await AccomodationSchema.find({
      city: req.params.cityId,
    });
    if (accomodations) {
      res.status(200).send(accomodations);
    } else {
      res.status(404).send("Accomodation not found");
    }
  } catch (error) {
    console.log(error);
  }
});
export default DesRouter;



DesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { available } = req.query

    const destination = await DestinationSchema.find(
      available
        ? { _id: [...(await AccomodationSchema.find().populate("city").distinct("city"))] }
        : {}
    );

    if (destination) {
      res.status(200).send(destination);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    res.status(404).send();
    console.log();
  }
});