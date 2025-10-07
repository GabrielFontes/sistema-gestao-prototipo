


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."gerar_slug_workspace"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  NEW.slug := lower(regexp_replace(NEW.name, '\s+', '-', 'g'));
  NEW.slug := regexp_replace(NEW.slug, '[^a-z0-9\-]', '', 'g');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."gerar_slug_workspace"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_empresa_members_with_details"("p_empresa_id" "uuid") RETURNS TABLE("id" "uuid", "user_id" "uuid", "email" "text", "display_name" "text", "role" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM empresa_members em
    WHERE em.empresa_id = p_empresa_id
      AND em.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  RETURN QUERY
  SELECT 
    em.id,
    em.user_id,
    au.email::text,  -- 🔹 CONVERSÃO EXPLÍCITA
    COALESCE(
      au.raw_user_meta_data->>'display_name',
      au.raw_user_meta_data->>'full_name',
      au.email
    )::text AS display_name, -- 🔹 CONVERSÃO EXPLÍCITA
    em.role,
    em.created_at
  FROM empresa_members em
  JOIN auth.users au ON au.id = em.user_id
  WHERE em.empresa_id = p_empresa_id
  ORDER BY em.created_at;
END;
$$;


ALTER FUNCTION "public"."get_empresa_members_with_details"("p_empresa_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_owner_or_admin"("p_user_id" "uuid", "p_empresa_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.empresa_members em
    WHERE em.empresa_id = p_empresa_id
      AND em.user_id = p_user_id
      AND em.role IN ('owner', 'admin')
  );
END;
$$;


ALTER FUNCTION "public"."is_owner_or_admin"("p_user_id" "uuid", "p_empresa_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."empresa_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "empresa_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "empresa_members_role_check" CHECK (("role" = ANY (ARRAY['owner'::"text", 'admin'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."empresa_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."empresas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "subtitle" "text",
    "logo" "text",
    "primary_color" "text" DEFAULT '240 5.9% 10%'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "slug" "text",
    "dre_link" "text",
    "movimentacoes_link" "text",
    "fluxos_link" "text",
    "organograma_link" "text",
    "corpo_link" "text",
    "notas_link" "text",
    "projetos_link" "text",
    "operacao_link" "text",
    "sprint_link" "text"
);


ALTER TABLE "public"."empresas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."key_results" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "objective_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "target_value" numeric,
    "current_value" numeric DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "project_ids" "uuid"[],
    "unit" "text" DEFAULT '%'::"text"
);


ALTER TABLE "public"."key_results" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."milestones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "project_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "due_date" timestamp with time zone,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "milestones_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."milestones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."objectives" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "empresa_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "trimestre" integer NOT NULL,
    "year" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "objectives_quarter_check" CHECK ((("trimestre" >= 1) AND ("trimestre" <= 4)))
);


ALTER TABLE "public"."objectives" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "empresa_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "owner" "text",
    "target_value" numeric,
    "current_value" numeric DEFAULT 0,
    "unit" "text" DEFAULT '%'::"text",
    CONSTRAINT "projects_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'completed'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "milestone_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "assigned_to" "uuid",
    "due_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "tasks_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_progress'::"text", 'completed'::"text"])))
);


ALTER TABLE "public"."tasks" OWNER TO "postgres";


ALTER TABLE ONLY "public"."empresa_members"
    ADD CONSTRAINT "empresa_members_empresa_id_user_id_key" UNIQUE ("empresa_id", "user_id");



ALTER TABLE ONLY "public"."empresa_members"
    ADD CONSTRAINT "empresa_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."empresas"
    ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."empresas"
    ADD CONSTRAINT "empresas_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."key_results"
    ADD CONSTRAINT "key_results_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."milestones"
    ADD CONSTRAINT "milestones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."objectives"
    ADD CONSTRAINT "objectives_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_key_results_project_ids" ON "public"."key_results" USING "gin" ("project_ids");



CREATE OR REPLACE TRIGGER "trg_gerar_slug_empresas" BEFORE INSERT OR UPDATE OF "name" ON "public"."empresas" FOR EACH ROW EXECUTE FUNCTION "public"."gerar_slug_workspace"();



CREATE OR REPLACE TRIGGER "update_empresas_updated_at" BEFORE UPDATE ON "public"."empresas" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_key_results_updated_at" BEFORE UPDATE ON "public"."key_results" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_milestones_updated_at" BEFORE UPDATE ON "public"."milestones" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_objectives_updated_at" BEFORE UPDATE ON "public"."objectives" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_projects_updated_at" BEFORE UPDATE ON "public"."projects" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "update_tasks_updated_at" BEFORE UPDATE ON "public"."tasks" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



ALTER TABLE ONLY "public"."empresa_members"
    ADD CONSTRAINT "empresa_members_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."empresa_members"
    ADD CONSTRAINT "empresa_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."key_results"
    ADD CONSTRAINT "key_results_objective_id_fkey" FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."milestones"
    ADD CONSTRAINT "milestones_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."objectives"
    ADD CONSTRAINT "objectives_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."empresas"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE CASCADE;



ALTER TABLE "public"."empresa_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."empresas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."key_results" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "members_can_create_objectives" ON "public"."objectives" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "objectives"."empresa_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "members_can_create_projects" ON "public"."projects" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "projects"."empresa_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "members_can_manage_key_results" ON "public"."key_results" USING ((EXISTS ( SELECT 1
   FROM ("public"."objectives"
     JOIN "public"."empresa_members" ON (("empresa_members"."empresa_id" = "objectives"."empresa_id")))
  WHERE (("objectives"."id" = "key_results"."objective_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "members_can_manage_milestones" ON "public"."milestones" USING ((EXISTS ( SELECT 1
   FROM ("public"."projects"
     JOIN "public"."empresa_members" ON (("empresa_members"."empresa_id" = "projects"."empresa_id")))
  WHERE (("projects"."id" = "milestones"."project_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "members_can_manage_tasks" ON "public"."tasks" USING ((EXISTS ( SELECT 1
   FROM (("public"."milestones"
     JOIN "public"."projects" ON (("projects"."id" = "milestones"."project_id")))
     JOIN "public"."empresa_members" ON (("empresa_members"."empresa_id" = "projects"."empresa_id")))
  WHERE (("milestones"."id" = "tasks"."milestone_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "members_can_update_objectives" ON "public"."objectives" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "objectives"."empresa_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "members_can_update_projects" ON "public"."projects" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "projects"."empresa_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."milestones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."objectives" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "owners_and_admins_can_delete_objectives" ON "public"."objectives" FOR DELETE USING ("public"."is_owner_or_admin"("auth"."uid"(), "empresa_id"));



CREATE POLICY "owners_and_admins_can_delete_projects" ON "public"."projects" FOR DELETE USING ("public"."is_owner_or_admin"("auth"."uid"(), "empresa_id"));



CREATE POLICY "owners_and_admins_can_manage_members" ON "public"."empresa_members" USING ("public"."is_owner_or_admin"("auth"."uid"(), "empresa_id"));



CREATE POLICY "owners_and_admins_can_update_empresas" ON "public"."empresas" FOR UPDATE USING ("public"."is_owner_or_admin"("auth"."uid"(), "id"));



CREATE POLICY "owners_and_admins_can_view_members" ON "public"."empresa_members" FOR SELECT USING ("public"."is_owner_or_admin"("auth"."uid"(), "empresa_id"));



CREATE POLICY "owners_can_delete_empresas" ON "public"."empresas" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "empresas"."id") AND ("empresa_members"."user_id" = "auth"."uid"()) AND ("empresa_members"."role" = 'owner'::"text")))));



ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tasks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_can_add_themselves_as_members" ON "public"."empresa_members" FOR INSERT WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "users_can_create_empresas" ON "public"."empresas" FOR INSERT WITH CHECK (true);



CREATE POLICY "users_can_view_empresas" ON "public"."empresas" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "empresas"."id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_can_view_key_results" ON "public"."key_results" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."objectives"
     JOIN "public"."empresa_members" ON (("empresa_members"."empresa_id" = "objectives"."empresa_id")))
  WHERE (("objectives"."id" = "key_results"."objective_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_can_view_milestones" ON "public"."milestones" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."projects"
     JOIN "public"."empresa_members" ON (("empresa_members"."empresa_id" = "projects"."empresa_id")))
  WHERE (("projects"."id" = "milestones"."project_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_can_view_objectives" ON "public"."objectives" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "objectives"."empresa_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_can_view_projects" ON "public"."projects" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."empresa_members"
  WHERE (("empresa_members"."empresa_id" = "projects"."empresa_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_can_view_tasks" ON "public"."tasks" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."milestones"
     JOIN "public"."projects" ON (("projects"."id" = "milestones"."project_id")))
     JOIN "public"."empresa_members" ON (("empresa_members"."empresa_id" = "projects"."empresa_id")))
  WHERE (("milestones"."id" = "tasks"."milestone_id") AND ("empresa_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "users_can_view_their_memberships" ON "public"."empresa_members" FOR SELECT USING (("user_id" = "auth"."uid"()));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."gerar_slug_workspace"() TO "anon";
GRANT ALL ON FUNCTION "public"."gerar_slug_workspace"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."gerar_slug_workspace"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_empresa_members_with_details"("p_empresa_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_empresa_members_with_details"("p_empresa_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_empresa_members_with_details"("p_empresa_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_owner_or_admin"("p_user_id" "uuid", "p_empresa_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_owner_or_admin"("p_user_id" "uuid", "p_empresa_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_owner_or_admin"("p_user_id" "uuid", "p_empresa_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."empresa_members" TO "anon";
GRANT ALL ON TABLE "public"."empresa_members" TO "authenticated";
GRANT ALL ON TABLE "public"."empresa_members" TO "service_role";



GRANT ALL ON TABLE "public"."empresas" TO "anon";
GRANT ALL ON TABLE "public"."empresas" TO "authenticated";
GRANT ALL ON TABLE "public"."empresas" TO "service_role";



GRANT ALL ON TABLE "public"."key_results" TO "anon";
GRANT ALL ON TABLE "public"."key_results" TO "authenticated";
GRANT ALL ON TABLE "public"."key_results" TO "service_role";



GRANT ALL ON TABLE "public"."milestones" TO "anon";
GRANT ALL ON TABLE "public"."milestones" TO "authenticated";
GRANT ALL ON TABLE "public"."milestones" TO "service_role";



GRANT ALL ON TABLE "public"."objectives" TO "anon";
GRANT ALL ON TABLE "public"."objectives" TO "authenticated";
GRANT ALL ON TABLE "public"."objectives" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;

