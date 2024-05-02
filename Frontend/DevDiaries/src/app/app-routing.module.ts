import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { PolicyComponent } from './policy/policy.component';
import { ProfileComponent } from './profile/profile.component';
import { PromoteComponent } from './promote/promote.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';

const routes: Routes = [{ path: 'login', component: LoginComponent },
{ path: '', redirectTo: 'dashboard', pathMatch: 'full'},
{ path:'register', component: RegisterComponent},
{ path:'forgot', component: ForgotPasswordComponent},
{ path:'create', component: CreatePostComponent,pathMatch: 'full', canActivate: [AuthGuard]},
{ path:'dashboard', component: DashboardComponent,pathMatch: 'full', canActivate: [AuthGuard]},
{ path: 'edit-post/:id', component: EditPostComponent ,pathMatch: 'full', canActivate: [AuthGuard]},
{ path: 'policy', component: PolicyComponent},
{ path:'profile', component: ProfileComponent,pathMatch: 'full', canActivate: [AuthGuard]},
{ path:'promote', component: PromoteComponent,pathMatch: 'full', canActivate: [AuthGuard]},
{ path:'deleteuser', component: DeleteUserComponent,pathMatch: 'full', canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
