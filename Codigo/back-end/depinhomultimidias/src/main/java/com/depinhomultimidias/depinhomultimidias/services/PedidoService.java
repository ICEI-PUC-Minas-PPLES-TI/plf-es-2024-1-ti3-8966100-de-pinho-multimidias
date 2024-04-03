package com.depinhomultimidias.depinhomultimidias.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.depinhomultimidias.depinhomultimidias.models.Pedido;
import com.depinhomultimidias.depinhomultimidias.repositories.PedidoRepository;

import jakarta.transaction.Transactional;
import lombok.NonNull;

@Service
public class PedidoService {
    @Autowired
    public PedidoRepository pedidoRepository;

    public Pedido findById(@NonNull Long id) {
        Optional<Pedido> pedido = this.pedidoRepository.findById(id);
        return pedido.orElseThrow(() -> new RuntimeException(
                "Objeto não encontrado! Id: " + id + ", Tipo: " + Pedido.class.getName()));
    }

    @Transactional
    public Pedido create(@NonNull Pedido pedido) {
        return this.pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido update(@NonNull Pedido pedido) {
        Pedido newPedido = findById(pedido.getId());
        newPedido.setStatus(pedido.getStatus());
        newPedido.setItens(pedido.getItens());
        newPedido.setUsuario(pedido.getUsuario());
        return pedidoRepository.save(newPedido);
    }
}