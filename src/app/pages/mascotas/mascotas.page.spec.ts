import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MascotasPage } from './mascotas.page';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { AuthService } from '../../services/auth.service';
import { SyncService } from '../../services/sync.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { StorageService } from '../../services/storage.service';

// Mock dependencies
const mockAuthService = {
  isAuthenticated: jest.fn().mockReturnValue(true),
  logout: jest.fn(),
  getCurrentUserId: jest.fn().mockReturnValue('test-user-id'),
  authState$: of({ uid: 'test-user-id' })
};

const mockSyncService = {
  syncState$: of({ status: 'idle', lastSyncedAt: null, message: '' }),
  sincronizarMascotas: jest.fn(),
  importarDesdeAPI: jest.fn()
};

const mockStorageService = {
  get: jest.fn().mockReturnValue([]),
  set: jest.fn()
};

const mockToastController = {
  create: jest.fn().mockResolvedValue({ present: jest.fn() })
};

const mockRouter = {
  navigateByUrl: jest.fn()
};

describe('MascotasPage', () => {
  let component: MascotasPage;
  let fixture: ComponentFixture<MascotasPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MascotasPage],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: SyncService, useValue: mockSyncService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: ToastController, useValue: mockToastController },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MascotasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take a photo using Camera', async () => {
    const mockPhoto = { dataUrl: 'data:image/jpeg;base64,test' };
    jest.spyOn(Camera, 'getPhoto').mockResolvedValue(mockPhoto as any);

    await component.tomarFoto();

    expect(Camera.getPhoto).toHaveBeenCalled();
    expect(component.fotoCapturada).toBe(mockPhoto.dataUrl);
  });

  it('should get current location using Geolocation', async () => {
    const mockPosition = {
      coords: { latitude: 10, longitude: 20 }
    };
    jest.spyOn(Geolocation, 'getCurrentPosition').mockResolvedValue(mockPosition as any);

    await component.obtenerUbicacion();

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
    expect(component.ubicacionActual).toEqual({ lat: 10, lng: 20 });
  });
});
