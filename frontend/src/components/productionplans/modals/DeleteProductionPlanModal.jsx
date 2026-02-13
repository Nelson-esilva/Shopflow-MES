import React from 'react';

function DeleteProductionPlanModal({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.15)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: 32, minWidth: 320, boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}>
        <h3 style={{ color: '#BE3124', marginBottom: 16 }}>Excluir plano?</h3>
        <p style={{ color: '#333', marginBottom: 24 }}>Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={onClose} style={{ padding: '8px 18px', borderRadius: 4, border: 'none', background: '#eee', color: '#333', cursor: 'pointer' }}>Cancelar</button>
          <button onClick={onConfirm} style={{ padding: '8px 18px', borderRadius: 4, border: 'none', background: '#BE3124', color: '#fff', cursor: 'pointer' }}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteProductionPlanModal; 