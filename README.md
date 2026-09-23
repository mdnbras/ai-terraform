# AI Terraform

Pacote de agentes especialistas para infraestrutura como código com Terraform no Kiro. Possui contexto próprio em `.kiro/` e é composto pelo AISDLC no repositório consumidor.

## Capacidades

- descoberta de roots, módulos, providers, workspaces e pipelines;
- design e implementação de módulos reutilizáveis;
- versionamento de providers e Terraform;
- state, imports, moves e migração de backend;
- segurança, policy as code, custo e compliance;
- validações, testes e revisão de planos;
- rollout e documentação operacional.

O pacote não presume cloud, backend, CI ou ferramenta de policy. Nunca executa `terraform apply`, destroy, import, state mutation ou operação remota automaticamente.

## Agentes

- `specialists/ai-terraform/orchestrator`
- `specialists/ai-terraform/module-architect`
- `specialists/ai-terraform/implementation-engineer`
- `specialists/ai-terraform/state-provider-engineer`
- `specialists/ai-terraform/security-policy-engineer`
- `specialists/ai-terraform/test-engineer`
- `specialists/ai-terraform/reviewer`

## Uso

```powershell
cd C:\MyPath\aisdlc
npm run specialist -- install ai-terraform --target C:\MyPath\minha-infra
```

Por padrão, o quality gate executa `terraform fmt -check -recursive` e `terraform validate` somente quando o diretório já foi inicializado. Testes exigem `AISDLC_TERRAFORM_TEST=1`, pois podem criar infraestrutura real.

## Especialistas companions

- `ai-aws`: define arquitetura, serviços, IAM, rede e critérios Well-Architected; Terraform implementa módulos e recursos.
- `ai-kubernetes`: define contratos de cluster, add-ons e workloads; Terraform implementa a infraestrutura declarativa correspondente.

Quando os pacotes estão instalados juntos, os orquestradores podem delegar entre si. O especialista de domínio revisa o resultado e o `ai-terraform` permanece responsável por HCL, state, validações e plan.
