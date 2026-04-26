-- Add is_admin flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Allow admins to update any campaign's status
CREATE POLICY "Admins can update campaigns"
  ON public.campaigns FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- After running this, mark your own account as admin:
-- UPDATE public.profiles SET is_admin = true WHERE id = auth.uid();
-- (Run that in the SQL editor while logged in — or use Table Editor to flip the toggle)
