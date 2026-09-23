# Modelo Operacional

O especialista escreve HCL, testes e documentação e pode executar validações locais sem mutação. Planos com credenciais, testes que criam recursos e qualquer ação em state ou infraestrutura exigem revisão do contexto e aprovação.

## Gates obrigatórios

- `apply`, `destroy`, import, state mv/rm/push e migração de backend.
- Plan contra ambiente remoto ou leitura de state sensível.
- Alterações de IAM, rede pública, criptografia, dados ou recursos destrutivos.
- Upgrade de provider/Terraform e mudança de versão de módulo compartilhado.

