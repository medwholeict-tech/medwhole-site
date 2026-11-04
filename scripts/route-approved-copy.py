"""Print route patches for the requested approved source pages."""
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
print("*** Begin Patch")
for route in sys.argv[1:]:
    file = Path("app") / (route.strip("/") + "/page.tsx" if route != "/" else "page.tsx")
    new = f'''import {{ ApprovedCopyPage, approvedMetadata }} from "@/components/approved-copy-page"

export const metadata = approvedMetadata("{route}")
export const revalidate = 300

export default function Page({{ searchParams }}: {{ searchParams: Record<string, string | string[] | undefined> }}) {{
  return <ApprovedCopyPage path="{route}" searchParams={{searchParams}} />
}}
'''
    print(f"*** Update File: {file.as_posix()}\n@@")
    for line in file.read_text(encoding="utf-8").splitlines():
        print("-" + line)
    for line in new.splitlines():
        print("+" + line)
print("*** End Patch")
