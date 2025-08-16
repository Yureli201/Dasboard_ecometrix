import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-navbar-user',
  standalone: true,          // importante para que funcione imports
  imports: [RouterModule, CommonModule],    // necesario para routerLink
  templateUrl: './navbar-user.html',
  styleUrls: ['./navbar-user.css']
})
export class NavbarUser {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
