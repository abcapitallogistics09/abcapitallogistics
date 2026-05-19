import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, CheckCircle, Truck, Plane, Ship, Clock, MapPin, AlertCircle } from "lucide-react";
import { useTrackShipment, getTrackShipmentQueryKey } from "@workspace/api-client-react";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Clock },
  in_transit: { label: "In Transit", color: "text-blue-600 bg-blue-50 border-blue-200", icon: Truck },
  customs_clearance: { label: "Customs Clearance", color: "text-purple-600 bg-purple-50 border-purple-200", icon: Package },
  out_for_delivery: { label: "Out for Delivery", color: "text-orange-600 bg-orange-50 border-orange-200", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle },
};

const freightIcons: Record<string, typeof Package> = {
  air: Plane,
  ocean: Ship,
  road: Truck,
};

export default function Tracking() {
  const [input, setInput] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: shipment, isLoading, isError } = useTrackShipment(trackingNumber, {
    query: {
      enabled: !!trackingNumber && submitted,
      queryKey: getTrackShipmentQueryKey(trackingNumber),
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setTrackingNumber(input.trim().toUpperCase());
    setSubmitted(true);
  }

  const status = shipment ? statusConfig[shipment.status] : null;
  const FreightIcon = shipment ? (freightIcons[shipment.freightType] || Package) : Package;
  const StatusIcon = status?.icon || Package;

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary py-32 pt-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary/80" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <p className="text-accent font-semibold mb-3 uppercase text-sm tracking-wide">Real-Time Tracking</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Track Your Shipment</h1>
            <p className="text-gray-300 text-lg mb-8">
              Enter your tracking number to get real-time visibility into your cargo's journey.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3" data-testid="form-tracking">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. ABCL-DEMO-001"
                className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-base"
                data-testid="input-tracking-number"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white h-12 px-6 font-semibold"
                data-testid="button-track"
              >
                <Search className="w-4 h-4 mr-2" />
                Track
              </Button>
            </form>
            <p className="text-gray-400 text-sm mt-3">
              Try demo numbers: ABCL-DEMO-001, ABCL-DEMO-002, ABCL-DEMO-003
            </p>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16 bg-background min-h-[400px]">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-secondary">
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                <span className="font-medium">Locating your shipment...</span>
              </div>
            </div>
          )}

          {isError && submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Tracking Number Not Found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't locate a shipment with that tracking number. Please check the number and try again, 
                or contact our support team for assistance.
              </p>
              <a
                href="tel:+237677238818"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium"
              >
                <Phone className="w-4 h-4" />
                Call +237 677-238-818
              </a>
            </motion.div>
          )}

          {shipment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
              data-testid="tracking-result"
            >
              {/* Shipment Header */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <FreightIcon className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-0.5">Tracking Number</p>
                      <p className="font-bold text-primary text-lg" data-testid="text-tracking-number">{shipment.trackingNumber}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status?.color}`} data-testid="text-shipment-status">
                    <StatusIcon className="w-4 h-4" />
                    {status?.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Origin</p>
                    <p className="font-semibold text-primary text-sm" data-testid="text-origin">{shipment.origin}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Destination</p>
                    <p className="font-semibold text-primary text-sm" data-testid="text-destination">{shipment.destination}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Est. Delivery</p>
                    <p className="font-semibold text-primary text-sm" data-testid="text-eta">{shipment.estimatedDelivery}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Carrier</p>
                    <p className="font-semibold text-primary text-sm" data-testid="text-carrier">{shipment.carrier}</p>
                  </div>
                </div>

                {shipment.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600">{shipment.description}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-primary mb-6">Shipment Timeline</h3>
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
                  {shipment.events.map((event, i) => {
                    const ec = statusConfig[event.status] || statusConfig.in_transit;
                    const EventIcon = ec.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative flex gap-5 mb-6 last:mb-0"
                        data-testid={`tracking-event-${i}`}
                      >
                        <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center ${i === 0 ? 'bg-white border-accent' : 'bg-white border-gray-200'}`}>
                          <EventIcon className={`w-4 h-4 ${i === 0 ? 'text-accent' : 'text-gray-400'}`} />
                        </div>
                        <div className={`flex-1 pb-6 last:pb-0 ${i === 0 ? 'opacity-100' : 'opacity-70'}`}>
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-primary text-sm">{event.description}</p>
                            <p className="text-xs text-gray-400">{event.date} {event.time}</p>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{event.location}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {!submitted && (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Enter a tracking number above to see shipment details</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.76 19.79 19.79 0 01.06 1.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}
