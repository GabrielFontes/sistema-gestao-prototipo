-- Get the first empresa and create sample conversations
DO $$
DECLARE
  v_empresa_id UUID;
  v_user1_id UUID;
  v_user2_id UUID;
  v_conv1_id UUID;
  v_conv2_id UUID;
BEGIN
  -- Get first empresa
  SELECT id INTO v_empresa_id FROM public.empresas LIMIT 1;
  
  -- Get two different users from empresa_members
  SELECT user_id INTO v_user1_id FROM public.empresa_members WHERE empresa_id = v_empresa_id LIMIT 1;
  SELECT user_id INTO v_user2_id FROM public.empresa_members WHERE empresa_id = v_empresa_id AND user_id != v_user1_id LIMIT 1;
  
  -- If we don't have 2 users, create a dummy second user ID (won't work in real scenario but good for structure)
  IF v_user2_id IS NULL THEN
    v_user2_id := gen_random_uuid();
  END IF;
  
  -- Create first conversation
  INSERT INTO public.conversations (id, empresa_id)
  VALUES (gen_random_uuid(), v_empresa_id)
  RETURNING id INTO v_conv1_id;
  
  -- Add members to first conversation
  INSERT INTO public.conversation_members (conversation_id, user_id)
  VALUES 
    (v_conv1_id, v_user1_id),
    (v_conv1_id, v_user2_id);
  
  -- Add messages to first conversation
  INSERT INTO public.messages (conversation_id, user_id, content, created_at)
  VALUES
    (v_conv1_id, v_user1_id, 'Olá! Tudo bem?', NOW() - INTERVAL '2 hours'),
    (v_conv1_id, v_user2_id, 'Oi! Tudo ótimo, e você?', NOW() - INTERVAL '1 hour 50 minutes'),
    (v_conv1_id, v_user1_id, 'Também estou bem! Vamos conversar sobre o projeto?', NOW() - INTERVAL '1 hour 40 minutes'),
    (v_conv1_id, v_user2_id, 'Claro! Me manda os detalhes.', NOW() - INTERVAL '1 hour 30 minutes');
  
  -- Create second conversation (if we have different users)
  IF v_user2_id IS NOT NULL THEN
    INSERT INTO public.conversations (id, empresa_id)
    VALUES (gen_random_uuid(), v_empresa_id)
    RETURNING id INTO v_conv2_id;
    
    -- Add members to second conversation (different pair)
    INSERT INTO public.conversation_members (conversation_id, user_id)
    VALUES 
      (v_conv2_id, v_user1_id),
      (v_conv2_id, v_user2_id);
    
    -- Add messages to second conversation
    INSERT INTO public.messages (conversation_id, user_id, content, created_at)
    VALUES
      (v_conv2_id, v_user2_id, 'Você viu o relatório?', NOW() - INTERVAL '30 minutes'),
      (v_conv2_id, v_user1_id, 'Sim, já revisei!', NOW() - INTERVAL '20 minutes');
  END IF;
END $$;