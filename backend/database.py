import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL et SUPABASE_KEY doivent être définis dans le fichier .env "
        "(copie .env.example en .env et remplis les valeurs)."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
