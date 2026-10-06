/**
 * HEALTHGUARD - Location & Nearby Healthcare Services
 * Privacy-First: Location is NEVER continuously tracked.
 * Only activated temporarily (30 minutes max) during an explicit emergency event.
 */

import { TemporaryLocation, HealthcareFacility } from '../types';

export class LocationService {
  private static activeEmergencyTokens: Map<string, TemporaryLocation> = new Map();

  /**
   * Generates a temporary 30-minute location token for emergency family coordination
   */
  public static createEmergencyLocationToken(
    userId: string,
    eventId: string,
    coords: { latitude: number; longitude: number; address?: string; accuracy?: number }
  ): TemporaryLocation {
    const token = 'loc_' + Math.random().toString(36).substring(2, 12);
    const now = Date.now();
    const validUntil = new Date(now + 30 * 60 * 1000).toISOString(); // 30 minutes

    const locationRecord: TemporaryLocation = {
      id: 'loc_rec_' + Math.random().toString(36).substring(2, 8),
      eventId,
      userId,
      token,
      latitude: coords.latitude || 12.9716, // Bangalore default center if simulated
      longitude: coords.longitude || 77.5946,
      address: coords.address || 'Residency Road, Ashok Nagar, Bengaluru, Karnataka 560025',
      accuracyMeters: coords.accuracy || 12,
      createdAt: new Date(now).toISOString(),
      validUntil,
      revoked: false,
    };

    this.activeEmergencyTokens.set(token, locationRecord);
    return locationRecord;
  }

  /**
   * Retrieves an emergency location by token, validating expiration and revocation
   */
  public static getByToken(token: string): TemporaryLocation | null {
    const loc = this.activeEmergencyTokens.get(token);
    if (!loc) return null;
    if (loc.revoked) return null;
    if (new Date(loc.validUntil).getTime() < Date.now()) {
      return null; // Expired
    }
    return loc;
  }

  /**
   * Immediately revokes active location sharing
   */
  public static revokeToken(token: string): boolean {
    const loc = this.activeEmergencyTokens.get(token);
    if (loc) {
      loc.revoked = true;
      return true;
    }
    return false;
  }

  /**
   * Calculate precise Haversine distance between two GPS coordinates in kilometers
   */
  public static calculateHaversineDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(1));
  }

  /**
   * Nearby healthcare facilities directory dynamically sorted by distance from user's coordinates
   */
  public static getNearbyFacilities(userLat?: number, userLng?: number): HealthcareFacility[] {
    const baseFacilities: Omit<HealthcareFacility, 'distanceKm'>[] = [
      {
        id: 'fac_1',
        name: 'Apollo Hospital & Emergency Trauma Unit',
        type: 'HOSPITAL',
        address: 'Bannerghatta Main Rd, Opposite IIM, Bilekahalli',
        phone: '+91 80 2630 4050',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.8948,
        longitude: 77.5991,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=12.8948,77.5991',
      },
      {
        id: 'fac_2',
        name: 'Manipal Hospital – 24/7 Emergency & Critical Care',
        type: 'HOSPITAL',
        address: '98, HAL Old Airport Rd, Kodihalli',
        phone: '+91 80 2502 4444',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.9589,
        longitude: 77.6499,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=12.9589,77.6499',
      },
      {
        id: 'fac_3',
        name: 'Fortis Hospital & Cardiac Emergency Unit',
        type: 'HOSPITAL',
        address: '14, Cunningham Rd, Vasanth Nagar',
        phone: '+91 80 4199 4444',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.9877,
        longitude: 77.5959,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=12.9877,77.5959',
      },
      {
        id: 'fac_4',
        name: 'National Emergency Ambulance Service (108 / 112)',
        type: 'AMBULANCE',
        address: 'State Emergency Medical Dispatch Center',
        phone: '108',
        emergencyDepartment: true,
        operatingHours: 'Continuous 24/7 Dispatch',
        latitude: userLat || 12.9716,
        longitude: userLng || 77.5946,
        directionsUrl: 'tel:108',
      },
      {
        id: 'fac_5',
        name: 'Narayana Institute of Cardiac Sciences',
        type: 'HOSPITAL',
        address: '258/A, Bommasandra Industrial Area, Anekal Taluk',
        phone: '+91 80 7122 2222',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.8123,
        longitude: 77.6891,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=12.8123,77.6891',
      },
      {
        id: 'fac_6',
        name: 'MedPlus 24-Hour Pharmacy & First Aid Depot',
        type: 'PHARMACY',
        address: 'Brigade Road, Ashok Nagar',
        phone: '+91 80 2558 1234',
        emergencyDepartment: false,
        operatingHours: 'Open 24 Hours',
        latitude: 12.9725,
        longitude: 77.6074,
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=12.9725,77.6074',
      },
    ];

    const currentLat = userLat ?? 12.9716;
    const currentLng = userLng ?? 77.5946;

    return baseFacilities
      .map((facility) => {
        const distanceKm =
          facility.type === 'AMBULANCE'
            ? 0.5
            : this.calculateHaversineDistanceKm(
                currentLat,
                currentLng,
                facility.latitude,
                facility.longitude
              );
        return {
          ...facility,
          distanceKm,
          directionsUrl:
            facility.type === 'AMBULANCE'
              ? 'tel:108'
              : `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`,
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
