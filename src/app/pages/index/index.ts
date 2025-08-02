import { Component } from '@angular/core';
import { Navbar } from "../../components/navbar/navbar";
import { Footer } from "../../components/footer/footer";

@Component({
  selector: 'app-index',
  imports: [Navbar, Footer],
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index {

}
