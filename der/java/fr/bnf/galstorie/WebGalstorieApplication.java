package fr.bnf.galstorie;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@ServletComponentScan
@SpringBootApplication
@EnableWebMvc

public class WebGalstorieApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebGalstorieApplication.class, args);
	}


}
