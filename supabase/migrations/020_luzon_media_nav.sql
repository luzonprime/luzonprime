-- Luzon Media (sister brand) gets its own top-level navigation entry, sitting
-- inline beside Agents and Services rather than being buried under "More".
--
-- nav_items has no unique constraint on href, so the insert is guarded to keep
-- re-running the migration idempotent.

insert into nav_items (label, href, grp, sort_order)
select 'Luzon Media', '/luzon-media', 'inline', 3
where not exists (select 1 from nav_items where href = '/luzon-media');
