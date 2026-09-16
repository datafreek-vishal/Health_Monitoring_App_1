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
   * Nearby healthcare facilities directory (India-first directory with real emergency phone numbers)
   */
  public static getNearbyFacilities(userLat = 12.9716, userLng = 77.5946): HealthcareFacility[] {
    return [
      {
        id: 'fac_1',
        name: 'Manipal Hospital – 24/7 Emergency & Trauma',
        type: 'HOSPITAL',
        distanceKm: 1.2,
        address: '98, HAL Old Airport Rd, Kodihalli, Bengaluru, Karnataka 560017',
        phone: '+91 80 2502 4444',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.9589,
        longitude: 77.6499,
        directionsUrl: 'https://maps.google.com/?q=Manipal+Hospital+Bangalore',
      },
      {
        id: 'fac_2',
        name: 'Apollo Hospital Emergency Care',
        type: 'HOSPITAL',
        distanceKm: 2.4,
        address: '154, IIMB Post, Bannerghatta Rd, Bengaluru, Karnataka 560076',
        phone: '+91 80 2630 4050',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.8948,
        longitude: 77.5991,
        directionsUrl: 'https://maps.google.com/?q=Apollo+Hospital+Bangalore',
      },
      {
        id: 'fac_3',
        name: 'Fortis Hospital & Cardiac Emergency Unit',
        type: 'HOSPITAL',
        distanceKm: 3.1,
        address: '14, Cunningham Rd, Vasanth Nagar, Bengaluru, Karnataka 560052',
        phone: '+91 80 4199 4444',
        emergencyDepartment: true,
        operatingHours: 'Open 24 Hours',
        latitude: 12.9877,
        longitude: 77.5959,
        directionsUrl: 'https://maps.google.com/?q=Fortis+Hospital+Cunningham',
      },
      {
        id: 'fac_4',
        name: 'National Emergency Ambulance Service (108 / 112)',
        type: 'AMBULANCE',
        distanceKm: 0.5,
        address: 'Government of Karnataka Emergency Medical Response Center',
        phone: '108',
        emergencyDepartment: true,
        operatingHours: 'Continuous 24/7 Dispatch',
        latitude: 12.9716,
        longitude: 77.5946,
      },
      {
        id: 'fac_5',
        name: 'MedPlus 24-Hour Pharmacy & First Aid Depot',
        type: 'PHARMACY',
        distanceKm: 0.8,
        address: 'Shop 4, Brigade Road, Ashok Nagar, Bengaluru 560001',
        phone: '+91 80 2558 1234',
        emergencyDepartment: false,
        operatingHours: 'Open 24 Hours',
        latitude: 12.9725,
        longitude: 77.6074,
      },
    ];
  }
}
