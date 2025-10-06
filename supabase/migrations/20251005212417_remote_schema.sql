drop trigger if exists "trg_gerar_slug" on "public"."empresas";

drop trigger if exists "update_workspaces_updated_at" on "public"."empresas";

alter table "public"."empresas" drop constraint "workspaces_slug_key";

alter table "public"."empresas" drop constraint "workspaces_pkey";

drop index if exists "public"."workspaces_pkey";

drop index if exists "public"."workspaces_slug_key";

CREATE UNIQUE INDEX empresas_pkey ON public.empresas USING btree (id);

CREATE UNIQUE INDEX empresas_slug_key ON public.empresas USING btree (slug);

alter table "public"."empresas" add constraint "empresas_pkey" PRIMARY KEY using index "empresas_pkey";

alter table "public"."empresas" add constraint "empresas_slug_key" UNIQUE using index "empresas_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.gerar_slug_workspace()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.slug := lower(regexp_replace(NEW.name, '\s+', '-', 'g'));
  NEW.slug := regexp_replace(NEW.slug, '[^a-z0-9\-]', '', 'g');
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_owner_or_admin(workspace_id uuid, user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.empresa_members
    WHERE empresa_id = workspace_id
      AND user_id = user_id
      AND role IN ('owner', 'admin')
  );
END;
$function$
;

CREATE TRIGGER trg_gerar_slug_empresas BEFORE INSERT OR UPDATE OF name ON public.empresas FOR EACH ROW EXECUTE FUNCTION gerar_slug_workspace();

CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION handle_updated_at();



