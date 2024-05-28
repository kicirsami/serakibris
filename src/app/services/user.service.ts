import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient, private storage: Storage) {}

  async getUserInfo() {
    try {
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      const userInfo = await this.http.get<any>(`${this.apiUrl}/getUserInfo`, { headers }).toPromise();
      return userInfo;
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      return null;
    }
  }

  async updateUserInfo(user: any, file?: File): Promise<any> {
  try {
    const token = await this.storage.get('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('fullname', user.fullname);
    formData.append('phone', user.phone);
    formData.append('email', user.email);
    formData.append('role_id', user.role_id.toString());

    if (user.password) {
      formData.append('password', user.password);
    }

    if (file) {
      formData.append('file', file);
    }

    const response = await this.http.put<any>(`${this.apiUrl}/user/${user.id}`, formData, { headers }).toPromise();
    return response;
  } catch (error) {
    console.error('Kullanıcı bilgileri güncellenemedi:', error);
    throw error;
  }
}

  async uploadProfileImage(user: any, file: File): Promise<any> {
    try {
      const token = await this.storage.get('token');
      const formData = new FormData();
      formData.append('file', file);

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const response = await this.http.put<any>(`${this.apiUrl}/user/${user.id}`, formData, { headers }).toPromise();
    return response;
    } catch (error) {
      console.error('Profil resmi yüklenemedi:', error);
      throw error;
    }
  }

  async getTeamMembers(userId: number): Promise<any> {
    try {
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
  
      const teamMembers = await this.http.get<any>(`${this.apiUrl}/user/${userId}/team-members`, { headers }).toPromise();
      
      // Burada gelen verileri userId'ye göre filtreleyin
      const filteredTeamMembers = teamMembers.filter((member: any) => member.id !== userId);
  
      return filteredTeamMembers;
    } catch (error) {
      console.error('Error fetching team members', error);
      throw error;
    }
  }

  async getManagerInfo(userId: number): Promise<any> {
    try {
      const token = await this.storage.get('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      const managerInfo = await this.http.get<any>(`${this.apiUrl}/user/${userId}/manager`, { headers }).toPromise();
      return managerInfo;
    } catch (error) {
      console.error('Yönetici bilgileri alınamadı:', error);
      throw error;
    }
  }

}
