alter table "public"."empresa_members" drop constraint "workspace_members_role_check";

alter table "public"."empresa_members" drop constraint "workspace_members_user_id_fkey";

alter table "public"."empresa_members" drop constraint "workspace_members_workspace_id_fkey";

alter table "public"."empresa_members" drop constraint "workspace_members_workspace_id_user_id_key";

alter table "public"."empresa_members" drop constraint "workspace_members_pkey";

drop index if exists "public"."workspace_members_pkey";

drop index if exists "public"."workspace_members_workspace_id_user_id_key";

CREATE UNIQUE INDEX empresa_members_empresa_id_user_id_key ON public.empresa_members USING btree (empresa_id, user_id);

CREATE UNIQUE INDEX empresa_members_pkey ON public.empresa_members USING btree (id);

alter table "public"."empresa_members" add constraint "empresa_members_pkey" PRIMARY KEY using index "empresa_members_pkey";

alter table "public"."empresa_members" add constraint "empresa_members_empresa_id_fkey" FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE not valid;

alter table "public"."empresa_members" validate constraint "empresa_members_empresa_id_fkey";

alter table "public"."empresa_members" add constraint "empresa_members_empresa_id_user_id_key" UNIQUE using index "empresa_members_empresa_id_user_id_key";

alter table "public"."empresa_members" add constraint "empresa_members_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text]))) not valid;

alter table "public"."empresa_members" validate constraint "empresa_members_role_check";

alter table "public"."empresa_members" add constraint "empresa_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."empresa_members" validate constraint "empresa_members_user_id_fkey";

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
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = $1
    AND user_id = $2
    AND role IN ('owner', 'admin')
  );
$function$
;



