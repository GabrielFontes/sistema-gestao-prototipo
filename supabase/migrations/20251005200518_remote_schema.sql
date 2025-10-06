drop trigger if exists "update_empresas_updated_at" on "public"."empresas";

drop policy "Empresa owners and admins can manage members" on "public"."empresa_members";

drop policy "Users can view members of their empresas" on "public"."empresa_members";

drop policy "Empresa owners and admins can update empresa" on "public"."empresas";

drop policy "Users can view empresas they are members of" on "public"."empresas";

drop policy "Empresa members can manage milestones" on "public"."milestones";

drop policy "Users can view milestones in their empresa projects" on "public"."milestones";

drop policy "Empresa members can create projects" on "public"."projects";

drop policy "Empresa members can update projects" on "public"."projects";

drop policy "Empresa owners and admins can delete projects" on "public"."projects";

drop policy "Users can view projects in their empresas" on "public"."projects";

drop policy "Empresa members can manage tasks" on "public"."tasks";

drop policy "Users can view tasks in their empresa milestones" on "public"."tasks";

revoke delete on table "public"."empresa_members" from "anon";

revoke insert on table "public"."empresa_members" from "anon";

revoke references on table "public"."empresa_members" from "anon";

revoke select on table "public"."empresa_members" from "anon";

revoke trigger on table "public"."empresa_members" from "anon";

revoke truncate on table "public"."empresa_members" from "anon";

revoke update on table "public"."empresa_members" from "anon";

revoke delete on table "public"."empresa_members" from "authenticated";

revoke insert on table "public"."empresa_members" from "authenticated";

revoke references on table "public"."empresa_members" from "authenticated";

revoke select on table "public"."empresa_members" from "authenticated";

revoke trigger on table "public"."empresa_members" from "authenticated";

revoke truncate on table "public"."empresa_members" from "authenticated";

revoke update on table "public"."empresa_members" from "authenticated";

revoke delete on table "public"."empresa_members" from "service_role";

revoke insert on table "public"."empresa_members" from "service_role";

revoke references on table "public"."empresa_members" from "service_role";

revoke select on table "public"."empresa_members" from "service_role";

revoke trigger on table "public"."empresa_members" from "service_role";

revoke truncate on table "public"."empresa_members" from "service_role";

revoke update on table "public"."empresa_members" from "service_role";

revoke delete on table "public"."empresas" from "anon";

revoke insert on table "public"."empresas" from "anon";

revoke references on table "public"."empresas" from "anon";

revoke select on table "public"."empresas" from "anon";

revoke trigger on table "public"."empresas" from "anon";

revoke truncate on table "public"."empresas" from "anon";

revoke update on table "public"."empresas" from "anon";

revoke delete on table "public"."empresas" from "authenticated";

revoke insert on table "public"."empresas" from "authenticated";

revoke references on table "public"."empresas" from "authenticated";

revoke select on table "public"."empresas" from "authenticated";

revoke trigger on table "public"."empresas" from "authenticated";

revoke truncate on table "public"."empresas" from "authenticated";

revoke update on table "public"."empresas" from "authenticated";

revoke delete on table "public"."empresas" from "service_role";

revoke insert on table "public"."empresas" from "service_role";

revoke references on table "public"."empresas" from "service_role";

revoke select on table "public"."empresas" from "service_role";

revoke trigger on table "public"."empresas" from "service_role";

revoke truncate on table "public"."empresas" from "service_role";

revoke update on table "public"."empresas" from "service_role";

revoke delete on table "public"."milestones" from "anon";

revoke insert on table "public"."milestones" from "anon";

revoke references on table "public"."milestones" from "anon";

revoke select on table "public"."milestones" from "anon";

revoke trigger on table "public"."milestones" from "anon";

revoke truncate on table "public"."milestones" from "anon";

revoke update on table "public"."milestones" from "anon";

revoke delete on table "public"."milestones" from "authenticated";

revoke insert on table "public"."milestones" from "authenticated";

revoke references on table "public"."milestones" from "authenticated";

revoke select on table "public"."milestones" from "authenticated";

revoke trigger on table "public"."milestones" from "authenticated";

revoke truncate on table "public"."milestones" from "authenticated";

revoke update on table "public"."milestones" from "authenticated";

revoke delete on table "public"."milestones" from "service_role";

revoke insert on table "public"."milestones" from "service_role";

revoke references on table "public"."milestones" from "service_role";

revoke select on table "public"."milestones" from "service_role";

revoke trigger on table "public"."milestones" from "service_role";

revoke truncate on table "public"."milestones" from "service_role";

revoke update on table "public"."milestones" from "service_role";

revoke delete on table "public"."projects" from "anon";

revoke insert on table "public"."projects" from "anon";

revoke references on table "public"."projects" from "anon";

revoke select on table "public"."projects" from "anon";

revoke trigger on table "public"."projects" from "anon";

revoke truncate on table "public"."projects" from "anon";

revoke update on table "public"."projects" from "anon";

revoke delete on table "public"."projects" from "authenticated";

revoke insert on table "public"."projects" from "authenticated";

revoke references on table "public"."projects" from "authenticated";

revoke select on table "public"."projects" from "authenticated";

revoke trigger on table "public"."projects" from "authenticated";

revoke truncate on table "public"."projects" from "authenticated";

revoke update on table "public"."projects" from "authenticated";

revoke delete on table "public"."projects" from "service_role";

revoke insert on table "public"."projects" from "service_role";

revoke references on table "public"."projects" from "service_role";

revoke select on table "public"."projects" from "service_role";

revoke trigger on table "public"."projects" from "service_role";

revoke truncate on table "public"."projects" from "service_role";

revoke update on table "public"."projects" from "service_role";

revoke delete on table "public"."tasks" from "anon";

revoke insert on table "public"."tasks" from "anon";

revoke references on table "public"."tasks" from "anon";

revoke select on table "public"."tasks" from "anon";

revoke trigger on table "public"."tasks" from "anon";

revoke truncate on table "public"."tasks" from "anon";

revoke update on table "public"."tasks" from "anon";

revoke delete on table "public"."tasks" from "authenticated";

revoke insert on table "public"."tasks" from "authenticated";

revoke references on table "public"."tasks" from "authenticated";

revoke select on table "public"."tasks" from "authenticated";

revoke trigger on table "public"."tasks" from "authenticated";

revoke truncate on table "public"."tasks" from "authenticated";

revoke update on table "public"."tasks" from "authenticated";

revoke delete on table "public"."tasks" from "service_role";

revoke insert on table "public"."tasks" from "service_role";

revoke references on table "public"."tasks" from "service_role";

revoke select on table "public"."tasks" from "service_role";

revoke trigger on table "public"."tasks" from "service_role";

revoke truncate on table "public"."tasks" from "service_role";

revoke update on table "public"."tasks" from "service_role";

alter table "public"."empresa_members" drop constraint "empresa_members_empresa_id_fkey";

alter table "public"."empresa_members" drop constraint "empresa_members_empresa_id_user_id_key";

alter table "public"."empresa_members" drop constraint "empresa_members_role_check";

alter table "public"."empresa_members" drop constraint "empresa_members_user_id_fkey";

alter table "public"."projects" drop constraint "projects_empresa_id_fkey";

drop function if exists "public"."is_empresa_member"(empresa_id uuid, user_id uuid);

alter table "public"."empresa_members" drop constraint "empresa_members_pkey";

alter table "public"."empresas" drop constraint "empresas_pkey";

drop index if exists "public"."empresa_members_empresa_id_user_id_key";

drop index if exists "public"."empresa_members_pkey";

drop index if exists "public"."empresas_pkey";

alter table "public"."empresas" add column "corpo_link" text;

alter table "public"."empresas" add column "dre_link" text;

alter table "public"."empresas" add column "fluxos_link" text;

alter table "public"."empresas" add column "movimentacoes_link" text;

alter table "public"."empresas" add column "notas_link" text;

alter table "public"."empresas" add column "operacao_link" text;

alter table "public"."empresas" add column "organograma_link" text;

alter table "public"."empresas" add column "projetos_link" text;

alter table "public"."empresas" add column "slug" text;

alter table "public"."empresas" add column "sprint_link" text;

alter table "public"."projects" drop column "empresa_id";

alter table "public"."projects" add column "workspace_id" uuid not null;

CREATE UNIQUE INDEX workspace_members_pkey ON public.empresa_members USING btree (id);

CREATE UNIQUE INDEX workspace_members_workspace_id_user_id_key ON public.empresa_members USING btree (empresa_id, user_id);

CREATE UNIQUE INDEX workspaces_pkey ON public.empresas USING btree (id);

CREATE UNIQUE INDEX workspaces_slug_key ON public.empresas USING btree (slug);

alter table "public"."empresa_members" add constraint "workspace_members_pkey" PRIMARY KEY using index "workspace_members_pkey";

alter table "public"."empresas" add constraint "workspaces_pkey" PRIMARY KEY using index "workspaces_pkey";

alter table "public"."empresa_members" add constraint "workspace_members_role_check" CHECK ((role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text]))) not valid;

alter table "public"."empresa_members" validate constraint "workspace_members_role_check";

alter table "public"."empresa_members" add constraint "workspace_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."empresa_members" validate constraint "workspace_members_user_id_fkey";

alter table "public"."empresa_members" add constraint "workspace_members_workspace_id_fkey" FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE not valid;

alter table "public"."empresa_members" validate constraint "workspace_members_workspace_id_fkey";

alter table "public"."empresa_members" add constraint "workspace_members_workspace_id_user_id_key" UNIQUE using index "workspace_members_workspace_id_user_id_key";

alter table "public"."empresas" add constraint "workspaces_slug_key" UNIQUE using index "workspaces_slug_key";

alter table "public"."projects" add constraint "projects_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES empresas(id) ON DELETE CASCADE not valid;

alter table "public"."projects" validate constraint "projects_workspace_id_fkey";

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

create policy "owners_and_admins_can_manage_members"
on "public"."empresa_members"
as permissive
for all
to public
using (is_owner_or_admin(empresa_id, auth.uid()));


create policy "owners_and_admins_can_view_members"
on "public"."empresa_members"
as permissive
for select
to public
using (is_owner_or_admin(empresa_id, auth.uid()));


create policy "users_can_add_themselves_as_members"
on "public"."empresa_members"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "users_can_view_their_memberships"
on "public"."empresa_members"
as permissive
for select
to public
using ((user_id = auth.uid()));


create policy "owners_and_admins_can_update_empresas"
on "public"."empresas"
as permissive
for update
to public
using (is_owner_or_admin(id, auth.uid()));


create policy "owners_can_delete_empresas"
on "public"."empresas"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM empresa_members
  WHERE ((empresa_members.empresa_id = empresas.id) AND (empresa_members.user_id = auth.uid()) AND (empresa_members.role = 'owner'::text)))));


create policy "users_can_create_empresas"
on "public"."empresas"
as permissive
for insert
to public
with check (true);


create policy "users_can_view_empresas"
on "public"."empresas"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM empresa_members
  WHERE ((empresa_members.empresa_id = empresas.id) AND (empresa_members.user_id = auth.uid())))));


create policy "members_can_manage_milestones"
on "public"."milestones"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (projects
     JOIN empresa_members ON ((empresa_members.empresa_id = projects.workspace_id)))
  WHERE ((projects.id = milestones.project_id) AND (empresa_members.user_id = auth.uid())))));


create policy "users_can_view_milestones"
on "public"."milestones"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM (projects
     JOIN empresa_members ON ((empresa_members.empresa_id = projects.workspace_id)))
  WHERE ((projects.id = milestones.project_id) AND (empresa_members.user_id = auth.uid())))));


create policy "members_can_create_projects"
on "public"."projects"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM empresa_members
  WHERE ((empresa_members.empresa_id = projects.workspace_id) AND (empresa_members.user_id = auth.uid())))));


create policy "members_can_update_projects"
on "public"."projects"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM empresa_members
  WHERE ((empresa_members.empresa_id = projects.workspace_id) AND (empresa_members.user_id = auth.uid())))));


create policy "owners_and_admins_can_delete_projects"
on "public"."projects"
as permissive
for delete
to public
using (is_owner_or_admin(workspace_id, auth.uid()));


create policy "users_can_view_projects"
on "public"."projects"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM empresa_members
  WHERE ((empresa_members.empresa_id = projects.workspace_id) AND (empresa_members.user_id = auth.uid())))));


create policy "members_can_manage_tasks"
on "public"."tasks"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM ((milestones
     JOIN projects ON ((projects.id = milestones.project_id)))
     JOIN empresa_members ON ((empresa_members.empresa_id = projects.workspace_id)))
  WHERE ((milestones.id = tasks.milestone_id) AND (empresa_members.user_id = auth.uid())))));


create policy "users_can_view_tasks"
on "public"."tasks"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM ((milestones
     JOIN projects ON ((projects.id = milestones.project_id)))
     JOIN empresa_members ON ((empresa_members.empresa_id = projects.workspace_id)))
  WHERE ((milestones.id = tasks.milestone_id) AND (empresa_members.user_id = auth.uid())))));


CREATE TRIGGER trg_gerar_slug BEFORE INSERT OR UPDATE OF name ON public.empresas FOR EACH ROW EXECUTE FUNCTION gerar_slug_workspace();

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.empresas FOR EACH ROW EXECUTE FUNCTION handle_updated_at();



