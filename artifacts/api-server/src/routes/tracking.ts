import { Router, type IRouter } from "express";
import { TrackShipmentParams } from "@workspace/api-zod";

const router: IRouter = Router();

const demoShipments: Record<string, object> = {
  "ABCL-DEMO-001": {
    trackingNumber: "ABCL-DEMO-001",
    status: "in_transit",
    origin: "Shanghai, China",
    destination: "Douala, Cameroon",
    estimatedDelivery: "2026-05-28",
    carrier: "CMA CGM",
    freightType: "ocean",
    weight: "2,400 kg",
    description: "Electronics & Consumer Goods - FCL 20ft Container",
    events: [
      {
        date: "2026-05-19",
        time: "14:30",
        location: "Douala Port, Cameroon",
        status: "customs_clearance",
        description: "Shipment arrived at Douala Port. Customs clearance in progress.",
      },
      {
        date: "2026-05-14",
        time: "08:00",
        location: "Port Said, Egypt",
        status: "in_transit",
        description: "Vessel transiting Suez Canal.",
      },
      {
        date: "2026-05-08",
        time: "22:15",
        location: "Singapore",
        status: "in_transit",
        description: "Departed Singapore. Next port: Port Said.",
      },
      {
        date: "2026-05-02",
        time: "10:00",
        location: "Shanghai, China",
        status: "in_transit",
        description: "Container loaded aboard CMA CGM vessel. Departed Shanghai.",
      },
      {
        date: "2026-04-30",
        time: "15:45",
        location: "Shanghai, China",
        status: "pending",
        description: "Cargo received at Shanghai terminal. Documentation verified.",
      },
    ],
  },
  "ABCL-DEMO-002": {
    trackingNumber: "ABCL-DEMO-002",
    status: "delivered",
    origin: "Dubai, UAE",
    destination: "Yaoundé, Cameroon",
    estimatedDelivery: "2026-05-15",
    carrier: "FedEx",
    freightType: "air",
    weight: "185 kg",
    description: "Medical Equipment - Priority Air Freight",
    events: [
      {
        date: "2026-05-15",
        time: "11:30",
        location: "Yaoundé, Cameroon",
        status: "delivered",
        description: "Shipment successfully delivered to recipient.",
      },
      {
        date: "2026-05-15",
        time: "07:00",
        location: "Nsimalen International Airport, Yaoundé",
        status: "out_for_delivery",
        description: "Out for final delivery.",
      },
      {
        date: "2026-05-14",
        time: "20:00",
        location: "Nsimalen International Airport, Yaoundé",
        status: "customs_clearance",
        description: "Customs clearance completed. Released for delivery.",
      },
      {
        date: "2026-05-13",
        time: "06:30",
        location: "Dubai International Airport",
        status: "in_transit",
        description: "Departed Dubai International Airport.",
      },
    ],
  },
  "ABCL-DEMO-003": {
    trackingNumber: "ABCL-DEMO-003",
    status: "out_for_delivery",
    origin: "Lagos, Nigeria",
    destination: "Douala, Cameroon",
    estimatedDelivery: "2026-05-20",
    carrier: "AB Capital Road Freight",
    freightType: "road",
    weight: "3,200 kg",
    description: "FMCG Products - Road Freight Cross-Border",
    events: [
      {
        date: "2026-05-19",
        time: "09:00",
        location: "Ekok Border Post, Cameroon",
        status: "out_for_delivery",
        description: "Cleared Ekok border crossing. En route to Douala.",
      },
      {
        date: "2026-05-18",
        time: "16:00",
        location: "Ikom, Cross River, Nigeria",
        status: "in_transit",
        description: "Convoy approaching Cameroon border.",
      },
      {
        date: "2026-05-17",
        time: "08:30",
        location: "Lagos, Nigeria",
        status: "in_transit",
        description: "Truck departed Lagos warehouse.",
      },
    ],
  },
};

router.get("/tracking/:trackingNumber", async (req, res): Promise<void> => {
  const params = TrackShipmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { trackingNumber } = params.data;
  const shipment = demoShipments[trackingNumber.toUpperCase()];

  if (!shipment) {
    res.status(404).json({ error: `No shipment found for tracking number: ${trackingNumber}` });
    return;
  }

  req.log.info({ trackingNumber }, "Tracking lookup");
  res.json(shipment);
});

export default router;
