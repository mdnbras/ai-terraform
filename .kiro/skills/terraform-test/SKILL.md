---
name: terraform-test
description: Crie e execute validações e testes Terraform proporcionais ao risco e sem surpresa de custo.
---

# Testar Terraform

Execute fmt e validate em diretório inicializado sem backend quando possível. Adicione validations, conditions e checks para invariantes. Em `terraform test`, prefira plan e mocks; apply em teste exige aprovação, ambiente isolado e cleanup confirmado.

