'use client';

import { useState, useEffect } from 'react';

interface ServiceOption {
  id: string;
  name: string;
  basePrice: number;
  description: string;
}

interface ExtraService {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'fixed' | 'per_unit' | 'per_room';
  unit?: string;
}

interface ApplianceService {
  id: string;
  name: string;
  price: number;
  description: string;
  unit: string;
}

interface WallService {
  id: string;
  name: string;
  price: number;
  description: string;
  unit: string;
}

interface WindowService {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'interior' | 'exterior';
}

interface RecurringOption {
  id: string;
  name: string;
  frequency: string;
  discount: number;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'regular',
    name: 'Regular Cleaning',
    basePrice: 90,
    description: 'Standard cleaning service for regular maintenance'
  },
  {
    id: 'deep',
    name: 'Deep Cleaning',
    basePrice: 185,
    description: 'Thorough cleaning including hard-to-reach areas'
  },
  {
    id: 'move-in',
    name: 'Move-in/Move-out',
    basePrice: 280,
    description: 'Comprehensive cleaning for moving situations'
  },
  {
    id: 'post-construction',
    name: 'Post-Construction',
    basePrice: 400,
    description: 'Specialized cleaning after construction work'
  }
];

const applianceServices: ApplianceService[] = [
  {
    id: 'oven',
    name: 'Oven Cleaning',
    price: 30,
    description: 'Deep cleaning of oven interior and exterior',
    unit: 'oven'
  },
  {
    id: 'microwave-dishwasher',
    name: 'Microwave & Dishwasher',
    price: 20,
    description: 'Cleaning of microwave and dishwasher',
    unit: 'unit'
  },
  {
    id: 'refrigerator',
    name: 'Refrigerator Cleaning',
    price: 35,
    description: 'Interior and exterior refrigerator cleaning',
    unit: 'refrigerator'
  }
];

const wallServices: WallService[] = [
  {
    id: 'walls',
    name: 'Wall Cleaning',
    price: 35,
    description: 'Wall cleaning per room',
    unit: 'room'
  }
];

const windowServices: WindowService[] = [
  {
    id: 'interior-windows',
    name: 'Interior Window Cleaning',
    price: 40,
    description: 'Interior window cleaning service',
    type: 'interior'
  },
  {
    id: 'exterior-windows',
    name: 'Exterior Window Cleaning',
    price: 10,
    description: 'Exterior window cleaning per window',
    type: 'exterior'
  }
];

const additionalServices: ExtraService[] = [
  {
    id: 'laundry',
    name: 'Laundry Service',
    price: 25,
    description: 'Wash, dry, fold, and leave neatly per load',
    type: 'per_unit',
    unit: 'load'
  },
  {
    id: 'make-beds',
    name: 'Make Beds',
    price: 10,
    description: 'Strip down and make beds',
    type: 'per_unit',
    unit: 'bed'
  },
  {
    id: 'trash-removal',
    name: 'Trash Removal',
    price: 10,
    description: 'Remove trash per bag',
    type: 'per_unit',
    unit: 'bag'
  }
];

const recurringOptions: RecurringOption[] = [
  {
    id: 'one-time',
    name: 'One Time',
    frequency: 'none',
    discount: 0
  },
  {
    id: 'weekly',
    name: 'Weekly Recurring',
    frequency: 'weekly',
    discount: 10
  },
  {
    id: 'biweekly',
    name: 'Bi-weekly Recurring',
    frequency: 'biweekly',
    discount: 10
  }
];

interface PriceCalculatorProps {
  onPriceChange?: (price: number) => void;
  onServiceChange?: (service: string) => void;
  onRecurringChange?: (recurring: string) => void;
  onServiceDetailsChange?: (details: any) => void;
}

export default function PriceCalculator({ onPriceChange, onServiceChange, onRecurringChange, onServiceDetailsChange }: PriceCalculatorProps) {
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([]);
  const [selectedWalls, setSelectedWalls] = useState<string[]>([]);
  const [selectedWindows, setSelectedWindows] = useState<string[]>([]);
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [exteriorWindows, setExteriorWindows] = useState(0);
  const [laundryLoads, setLaundryLoads] = useState(0);
  const [beds, setBeds] = useState(0);
  const [trashBags, setTrashBags] = useState(0);
  const [recurringType, setRecurringType] = useState<string>('one-time');
  // New quantity states for appliances and wall cleaning
  const [ovenCount, setOvenCount] = useState(0);
  const [microwaveDishwasherCount, setMicrowaveDishwasherCount] = useState(0);
  const [refrigeratorCount, setRefrigeratorCount] = useState(0);
  const [wallRoomsCount, setWallRoomsCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    calculatePrice();
  }, [
    selectedService, selectedAppliances, selectedWalls, selectedWindows, 
    selectedAdditional, bedrooms, bathrooms, exteriorWindows, laundryLoads, beds, trashBags, recurringType,
    ovenCount, microwaveDishwasherCount, refrigeratorCount, wallRoomsCount
  ]);

  useEffect(() => {
    if (onPriceChange) {
      onPriceChange(totalPrice);
    }
  }, [totalPrice, onPriceChange]);

  useEffect(() => {
    if (onServiceChange) {
      onServiceChange(selectedService);
    }
  }, [selectedService, onServiceChange]);

  useEffect(() => {
    if (onRecurringChange) {
      onRecurringChange(recurringType);
    }
  }, [recurringType, onRecurringChange]);

  useEffect(() => {
    if (onServiceDetailsChange) {
      onServiceDetailsChange({
        selectedService,
        selectedAppliances,
        selectedWalls,
        selectedWindows,
        selectedAdditional,
        bedrooms,
        bathrooms,
        exteriorWindows,
        laundryLoads,
        beds,
        trashBags,
        recurringType,
        ovenCount,
        microwaveDishwasherCount,
        refrigeratorCount,
        wallRoomsCount,
      });
    }
  }, [
    selectedService,
    selectedAppliances,
    selectedWalls,
    selectedWindows,
    selectedAdditional,
    bedrooms,
    bathrooms,
    exteriorWindows,
    laundryLoads,
    beds,
    trashBags,
    recurringType,
    ovenCount,
    microwaveDishwasherCount,
    refrigeratorCount,
    wallRoomsCount,
    onServiceDetailsChange
  ]);

  const calculatePrice = () => {
    if (!selectedService) {
      setTotalPrice(0);
      return;
    }

    const service = serviceOptions.find(s => s.id === selectedService);
    if (!service) return;

    let basePrice = service.basePrice;

    // Adjust for property size
    // const sizeMultiplier = Math.max(0.8, Math.min(1.5, squareFootage / 1000));
    // basePrice *= sizeMultiplier;

    // Room-based pricing: first bedroom and bathroom are included, additional ones cost extra
    const additionalBedrooms = Math.max(0, bedrooms - 1);
    const additionalBathrooms = Math.max(0, bathrooms - 1);
    const additionalRoomsCost = (additionalBedrooms * 47.50) + (additionalBathrooms * 57.50);

    // Add appliance services with quantities
    const appliancesTotal = selectedAppliances.reduce((total, applianceId) => {
      const appliance = applianceServices.find(a => a.id === applianceId);
      if (!appliance) return total;
      
      let quantity = 0;
      if (appliance.id === 'oven') quantity = ovenCount;
      else if (appliance.id === 'microwave-dishwasher') quantity = microwaveDishwasherCount;
      else if (appliance.id === 'refrigerator') quantity = refrigeratorCount;
      
      return total + (appliance.price * quantity);
    }, 0);

    // Add wall services with quantities
    const wallsTotal = selectedWalls.reduce((total, wallId) => {
      const wall = wallServices.find(w => w.id === wallId);
      if (!wall) return total;
      return total + (wall.price * wallRoomsCount);
    }, 0);

    // Add window services
    const windowsTotal = selectedWindows.reduce((total, windowId) => {
      const window = windowServices.find(w => w.id === windowId);
      if (window?.type === 'exterior') {
        return total + (window.price * exteriorWindows);
      }
      return total + (window?.price || 0);
    }, 0);

    // Add additional services
    const additionalTotal = selectedAdditional.reduce((total, serviceId) => {
      const service = additionalServices.find(s => s.id === serviceId);
      if (service?.id === 'laundry') {
        return total + (service.price * laundryLoads);
      } else if (service?.id === 'make-beds') {
        return total + (service.price * beds);
      } else if (service?.id === 'trash-removal') {
        return total + (service.price * trashBags);
      }
      return total + (service?.price || 0);
    }, 0);

    let subtotal = basePrice + additionalRoomsCost + appliancesTotal + wallsTotal + windowsTotal + additionalTotal;

    // Apply recurring discount
    const recurringOption = recurringOptions.find(r => r.id === recurringType);
    if (recurringOption && recurringOption.discount > 0) {
      const discount = (subtotal * recurringOption.discount) / 100;
      subtotal -= discount;
    }

    setTotalPrice(Math.round(subtotal));
  };

  const handleToggle = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>, id: string) => {
    setArray(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Service Type Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Type</h3>
        <div className="space-y-3">
          {serviceOptions.map((service) => (
            <label key={service.id} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="serviceType"
                value={service.id}
                checked={selectedService === service.id}
                onChange={(e) => setSelectedService(e.target.value)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    ${service.basePrice}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Recurring Service Options */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Frequency</h3>
        <div className="space-y-3">
          {recurringOptions.map((option) => (
            <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="recurringType"
                value={option.id}
                checked={recurringType === option.id}
                onChange={(e) => setRecurringType(e.target.value)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{option.name}</p>
                    {option.discount > 0 && (
                      <p className="text-sm text-green-600 font-medium">
                        {option.discount}% discount applied
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bedrooms
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bathrooms
            </label>
            <select
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appliance Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appliance Cleaning</h3>
        <div className="space-y-3">
          {applianceServices.map((service) => (
            <div key={service.id}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAppliances.includes(service.id)}
                  onChange={() => handleToggle(selectedAppliances, setSelectedAppliances, service.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      +${service.price}/{service.unit}
                    </span>
                  </div>
                </div>
              </label>
              {selectedAppliances.includes(service.id) && (
                <div className="ml-7 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of {service.unit}s
                  </label>
                  <input
                    type="number"
                    value={
                      service.id === 'oven' ? ovenCount :
                      service.id === 'microwave-dishwasher' ? microwaveDishwasherCount :
                      service.id === 'refrigerator' ? refrigeratorCount : 0
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (service.id === 'oven') setOvenCount(value);
                      else if (service.id === 'microwave-dishwasher') setMicrowaveDishwasherCount(value);
                      else if (service.id === 'refrigerator') setRefrigeratorCount(value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="10"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Wall Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wall Cleaning</h3>
        <div className="space-y-3">
          {wallServices.map((service) => (
            <div key={service.id}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedWalls.includes(service.id)}
                  onChange={() => handleToggle(selectedWalls, setSelectedWalls, service.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      +${service.price}/{service.unit}
                    </span>
                  </div>
                </div>
              </label>
              {selectedWalls.includes(service.id) && (
                <div className="ml-7 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of {service.unit}s
                  </label>
                  <input
                    type="number"
                    value={wallRoomsCount}
                    onChange={(e) => setWallRoomsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="20"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Window Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Window Cleaning</h3>
        <div className="space-y-3">
          {windowServices.map((service) => (
            <div key={service.id}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedWindows.includes(service.id)}
                  onChange={() => handleToggle(selectedWindows, setSelectedWindows, service.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      +${service.price}{service.type === 'exterior' ? '/window' : ''}
                    </span>
                  </div>
                </div>
              </label>
              {service.type === 'exterior' && selectedWindows.includes(service.id) && (
                <div className="ml-7 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Exterior Windows
                  </label>
                  <input
                    type="number"
                    value={exteriorWindows}
                    onChange={(e) => setExteriorWindows(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services</h3>
        <div className="space-y-3">
          {additionalServices.map((service) => (
            <div key={service.id}>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedAdditional.includes(service.id)}
                  onChange={() => handleToggle(selectedAdditional, setSelectedAdditional, service.id)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                    </div>
                    <span className="text-lg font-semibold text-blue-600">
                      +${service.price}/{service.unit}
                    </span>
                  </div>
                </div>
              </label>
              {selectedAdditional.includes(service.id) && (
                <div className="ml-7 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of {service.unit}s
                  </label>
                  <input
                    type="number"
                    value={
                      service.id === 'laundry' ? laundryLoads :
                      service.id === 'make-beds' ? beds :
                      service.id === 'trash-removal' ? trashBags : 0
                    }
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (service.id === 'laundry') setLaundryLoads(value);
                      else if (service.id === 'make-beds') setBeds(value);
                      else if (service.id === 'trash-removal') setTrashBags(value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="50"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      {totalPrice > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Price Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Base Service:</span>
              <span className="font-medium">
                ${serviceOptions.find(s => s.id === selectedService)?.basePrice}
              </span>
            </div>
            
            {selectedAppliances.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Appliance Cleaning:</span>
                <span className="font-medium">
                  +${selectedAppliances.reduce((total, id) => {
                    const service = applianceServices.find(s => s.id === id);
                    if (!service) return total;
                    
                    let quantity = 0;
                    if (service.id === 'oven') quantity = ovenCount;
                    else if (service.id === 'microwave-dishwasher') quantity = microwaveDishwasherCount;
                    else if (service.id === 'refrigerator') quantity = refrigeratorCount;
                    
                    return total + (service.price * quantity);
                  }, 0)}
                </span>
              </div>
            )}

            {selectedWalls.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Wall Cleaning:</span>
                <span className="font-medium">
                  +${selectedWalls.reduce((total, id) => {
                    const service = wallServices.find(s => s.id === id);
                    if (!service) return total;
                    return total + (service.price * wallRoomsCount);
                  }, 0)}
                </span>
              </div>
            )}

            {selectedWindows.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Window Cleaning:</span>
                <span className="font-medium">
                  +${selectedWindows.reduce((total, id) => {
                    const service = windowServices.find(s => s.id === id);
                    if (service?.type === 'exterior') {
                      return total + (service.price * exteriorWindows);
                    }
                    return total + (service?.price || 0);
                  }, 0)}
                </span>
              </div>
            )}

            {selectedAdditional.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Additional Services:</span>
                <span className="font-medium">
                  +${selectedAdditional.reduce((total, id) => {
                    const service = additionalServices.find(s => s.id === id);
                    if (service?.id === 'laundry') {
                      return total + (service.price * laundryLoads);
                    } else if (service?.id === 'make-beds') {
                      return total + (service.price * beds);
                    } else if (service?.id === 'trash-removal') {
                      return total + (service.price * trashBags);
                    }
                    return total + (service?.price || 0);
                  }, 0)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">Size & Room Adjustments:</span>
              <span className="font-medium text-green-600">
                Included
              </span>
            </div>

            {bedrooms > 1 || bathrooms > 1 ? (
              <div className="flex justify-between">
                <span className="text-gray-600">Additional Rooms:</span>
                <span className="font-medium">
                  +${(Math.max(0, bedrooms - 1) * 47.50) + (Math.max(0, bathrooms - 1) * 57.50)}
                </span>
              </div>
            ) : null}

            {recurringType !== 'one-time' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Recurring Discount:</span>
                <span className="font-medium text-green-600">
                  -{recurringOptions.find(r => r.id === recurringType)?.discount}%
                </span>
              </div>
            )}

            <div className="border-t border-blue-200 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-blue-600">${totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 