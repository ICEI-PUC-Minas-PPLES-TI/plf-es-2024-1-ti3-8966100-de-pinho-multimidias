package com.depinhomultimidias.depinhomultimidias.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.depinhomultimidias.depinhomultimidias.models.Pedido;
import com.depinhomultimidias.depinhomultimidias.services.PedidoService;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/pedido")
@Validated

public class PedidoController {
    @Autowired
    public PedidoService pedidoService;

    @GetMapping("/{id}")
    public ResponseEntity<Pedido> findById(@RequestParam("id") Long id) {
        return ResponseEntity.ok(this.pedidoService.findById(id));
        
    }

    @PostMapping
    public ResponseEntity<Pedido> create( @RequestBody Pedido pedido) {
        this.pedidoService.create(pedido);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(pedido.getId()).toUri();
        return ResponseEntity.created(uri).build();
    }
    
     @PutMapping("/{id}")
    public ResponseEntity<Pedido> update(@PathVariable("id") Long id, @RequestBody Pedido pedido) {
        pedido.setId(id);
        this.pedidoService.update(pedido);
        return ResponseEntity.noContent().build();
    }
    
}