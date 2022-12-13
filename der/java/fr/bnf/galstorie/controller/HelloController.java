package fr.bnf.galstorie.controller;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HelloController  {

	@GetMapping("/index")
	public String getHello(Model model) {
		return "index";
	}
//
//	@Override
//	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
//			throws IOException, ServletException {
//        HttpServletRequest req = (HttpServletRequest) request;
//        HttpServletResponse res = (HttpServletResponse) response;
// 
//        res.addHeader("Cross-Origin-Embedder-Policy", "require-corp");
//        res.addHeader("Cross-Origin-Opener-Policy", "same-origin");
//
//        chain.doFilter(req, res);
//		
//	}
	

}
