-- Fix audit trigger to handle tables without empresa_id
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  empresa_id_val UUID;
  user_id_val UUID;
BEGIN
  user_id_val := auth.uid();
  
  -- Try to get empresa_id if it exists in the table
  BEGIN
    empresa_id_val := NEW.empresa_id;
  EXCEPTION
    WHEN undefined_column THEN
      empresa_id_val := NULL;
  END;
  
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    INSERT INTO public.audit_logs (
      table_name,
      record_id,
      action,
      old_data,
      new_data,
      user_id,
      empresa_id
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id,
      TG_OP,
      CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
      to_jsonb(NEW),
      user_id_val,
      empresa_id_val
    );
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    BEGIN
      empresa_id_val := OLD.empresa_id;
    EXCEPTION
      WHEN undefined_column THEN
        empresa_id_val := NULL;
    END;
    
    INSERT INTO public.audit_logs (
      table_name,
      record_id,
      action,
      old_data,
      new_data,
      user_id,
      empresa_id
    ) VALUES (
      TG_TABLE_NAME,
      OLD.id,
      'DELETE',
      to_jsonb(OLD),
      NULL,
      user_id_val,
      empresa_id_val
    );
    RETURN OLD;
  END IF;
END;
$$;

-- Now insert sample tasks
DO $$
DECLARE
  v_milestone_id UUID;
BEGIN
  SELECT id INTO v_milestone_id FROM milestones LIMIT 1;
  
  IF v_milestone_id IS NOT NULL THEN
    INSERT INTO tasks (milestone_id, name, description, status, category, due_date, created_at)
    VALUES
      (v_milestone_id, 'Proposta de anime Tomás', 'Proposta de anime Tomás', 'pending', 'Proposta', '2026-07-14 14:00:00', NOW() - INTERVAL '2 days'),
      (v_milestone_id, 'Relatório da Muuh para EJU', 'Relatório da Muuh para EJU', 'pending', 'Proposta', NULL, NOW() - INTERVAL '1 day'),
      (v_milestone_id, 'Fazer proposta Kaissy programa de aceleração aplicativo para corredores', 'Fazer proposta Kaissy programa de aceleração Aplicativo para corredores: elaborar treinos de corrida de acordo com cada objetivo', 'in_progress', 'Processo', '2026-07-14 21:00:00', NOW() - INTERVAL '3 days'),
      (v_milestone_id, 'Calendário fazer redução da duração para trás', 'Calendário fazer redução da duração para trás', 'in_progress', 'Projeto', '2026-07-15 18:00:00', NOW() - INTERVAL '5 days'),
      (v_milestone_id, 'Tarefa 06', 'A mais útil', 'completed', 'Rotina', '2026-10-16 21:00:00', NOW() - INTERVAL '10 days'),
      (v_milestone_id, 'Tarefa 07', 'Tarefa com setor', 'completed', 'Rotina', '2026-10-10 21:00:00', NOW() - INTERVAL '15 days');
  END IF;
END;
$$;