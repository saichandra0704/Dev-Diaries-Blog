import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

interface LoginResponse {
    token: string;
    role: string;
    // Include other response properties here
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private readonly API_URL = 'http://localhost:5000/api';
    private isLoggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());


    constructor(private http: HttpClient, private router: Router) {}

    private hasToken(): boolean {
        return !!localStorage.getItem('userToken');
    }

    login(username: string, password: string): Observable<any> {
        return this.http.post<LoginResponse>(`${this.API_URL}/login`, { username, password })
            .pipe(map(response => {
                localStorage.setItem('username',username); 
                localStorage.setItem('userToken', response.token);  
                this.isLoggedInSubject.next(true)
                localStorage.setItem('role', response.role); 
                return response;
            }));
    }
    getCurrentUser(){
        return localStorage.getItem('username');
    }
    getUserRole(username: string | null): Observable<string> {
        return this.http.get<string>(`${this.API_URL}/role/${username}`, { responseType: 'text' as 'json' });
      }
      
    logout(): void {
        localStorage.removeItem('userToken');
        localStorage.removeItem('role');
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    get isLoggedIn(): Observable<boolean> {
        return this.isLoggedInSubject.asObservable();
    }
    verifySecurityQuestion(username: string, question: string, answer: string): Observable<any> {
        return this.http.post(`${this.API_URL}/verifySecurity`, { username, question, answer });
      }
    
    resetPassword(username: string, newPassword: string): Observable<any> {
        return this.http.post(`${this.API_URL}/resetPassword`, { username, newPassword });
    }
    createPost(title: string, content: string, username:string | null): Observable<any>  {
        return this.http.post(`${this.API_URL}/posts`, { title, content,username });
      }
    getAllPosts(): Observable<any> {
        return this.http.get(`${this.API_URL}/allposts`);
    }
    deletePost(postId: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/posts/${postId}`);
    }
    getPost(postId: string): Observable<any> {
        return this.http.get(`${this.API_URL}/posts/${postId}`);
    }
      
      updatePost(postId: string, post: any): Observable<any> {
        return this.http.put(`${this.API_URL}/posts/${postId}`, post);
    }
    getProfile(username:string | null): Observable<any> {
        return this.http.get(`${this.API_URL}/profile/${username}`);
      }
    
    updateProfile(data: any): Observable<any> {
        console.log(data)
        return this.http.put(`${this.API_URL}/users/edit-profile`, data);
      }
    promoteUser(username: string): Observable<any> {
        return this.http.post(`${this.API_URL}/users/promote`, username);
    }
    deleteUser(username: string): Observable<any> {
        return this.http.post(`${this.API_URL}/users`,username);
    }
}
