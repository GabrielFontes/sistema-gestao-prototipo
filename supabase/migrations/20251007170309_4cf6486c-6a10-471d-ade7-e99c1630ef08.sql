-- Inserir projetos de teste
INSERT INTO projects (empresa_id, name, description, owner, status, target_value, current_value)
VALUES 
  ('949a1806-19ab-4de1-8777-a657ac9edbaa', 'Novo Sistema CRM', 'Implementação do sistema de CRM', 'João Silva', 'active', 100, 35),
  ('949a1806-19ab-4de1-8777-a657ac9edbaa', 'Expansão Digital', 'Expansão da presença digital', 'Maria Santos', 'active', 200, 120),
  ('949a1806-19ab-4de1-8777-a657ac9edbaa', 'Automação Processos', 'Automatizar processos internos', 'Pedro Costa', 'active', 150, 90);

-- Inserir objetivos de teste para T1 2025
INSERT INTO objectives (empresa_id, name, description, trimestre, year)
VALUES 
  ('949a1806-19ab-4de1-8777-a657ac9edbaa', 'Aumentar Receita', 'Crescer receita em 30% no primeiro trimestre', 1, 2025),
  ('949a1806-19ab-4de1-8777-a657ac9edbaa', 'Melhorar Eficiência Operacional', 'Reduzir custos operacionais e aumentar produtividade', 1, 2025);

-- Inserir key results de teste
-- Precisamos dos IDs dos objetivos e projetos que acabamos de criar
WITH obj AS (
  SELECT id FROM objectives WHERE empresa_id = '949a1806-19ab-4de1-8777-a657ac9edbaa' ORDER BY created_at DESC LIMIT 2
),
proj AS (
  SELECT id FROM projects WHERE empresa_id = '949a1806-19ab-4de1-8777-a657ac9edbaa' ORDER BY created_at DESC LIMIT 3
)
INSERT INTO key_results (objective_id, name, description, target_value, current_value, project_ids)
SELECT 
  (SELECT id FROM obj LIMIT 1 OFFSET 0),
  'Atingir R$ 500k em vendas',
  'Meta de vendas para o trimestre',
  500,
  155,
  ARRAY[(SELECT id FROM proj LIMIT 1 OFFSET 0), (SELECT id FROM proj LIMIT 1 OFFSET 1)]
UNION ALL
SELECT 
  (SELECT id FROM obj LIMIT 1 OFFSET 0),
  'Conquistar 50 novos clientes',
  'Meta de aquisição de clientes',
  50,
  28,
  ARRAY[(SELECT id FROM proj LIMIT 1 OFFSET 0)]
UNION ALL
SELECT 
  (SELECT id FROM obj LIMIT 1 OFFSET 1),
  'Reduzir tempo de resposta em 40%',
  'Melhorar SLA de atendimento',
  40,
  22,
  ARRAY[(SELECT id FROM proj LIMIT 1 OFFSET 2)];