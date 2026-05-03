import { Mail, Upload, User } from "lucide-react";
import { FormEvent, useState } from "react";
import { type AuthUser } from "wasp/auth";
import { useAction } from "wasp/client/operations";
import { Button } from "../../../client/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../client/components/ui/card";
import { Input } from "../../../client/components/ui/input";
import { Label } from "../../../client/components/ui/label";
import Breadcrumb from "../../layout/Breadcrumb";
import DefaultLayout from "../../layout/DefaultLayout";

const SettingsPage = ({ user }: { user: AuthUser }) => {
  // @ts-ignore - Wasp SDK type mismatch: AuthenticatedOperation vs Action generic params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateProfile: any = useAction(useAction as any);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    const form = event.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement)?.value || undefined,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement)?.value || undefined,
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value || undefined,
      postalCode: (form.elements.namedItem("postalCode") as HTMLInputElement)?.value || undefined,
      username: (form.elements.namedItem("username") as HTMLInputElement)?.value || undefined,
    };

    try {
      await updateProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultLayout user={user}>
      <div className="max-w-270 mx-auto">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 gap-5.5 flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <Label
                        htmlFor="firstName"
                        className="text-foreground mb-3 block text-sm font-medium"
                      >
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="left-4.5 text-muted-foreground absolute top-2 h-5 w-5" />
                        <Input
                          className="pl-11.5"
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="First name"
                          defaultValue={user.firstName ?? ""}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <Label
                        htmlFor="lastName"
                        className="text-foreground mb-3 block text-sm font-medium"
                      >
                        Last Name
                      </Label>
                      <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last name"
                        defaultValue={user.lastName ?? ""}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <Label
                      htmlFor="phone"
                      className="text-foreground mb-3 block text-sm font-medium"
                    >
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      name="phone"
                      id="phone"
                      placeholder="+1 (416) 555-0100"
                      defaultValue={user.phone ?? ""}
                    />
                  </div>

                  <div className="mb-5.5">
                    <Label
                      htmlFor="postalCode"
                      className="text-foreground mb-3 block text-sm font-medium"
                    >
                      Postal Code
                    </Label>
                    <Input
                      type="text"
                      name="postalCode"
                      id="postalCode"
                      placeholder="L9T 1R3"
                      defaultValue={user.postalCode ?? ""}
                    />
                  </div>

                  <div className="mb-5.5">
                    <Label
                      htmlFor="email-address"
                      className="text-foreground mb-3 block text-sm font-medium"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="left-4.5 text-muted-foreground absolute top-2 h-5 w-5" />
                      <Input
                        className="pl-11.5"
                        type="email"
                        name="emailAddress"
                        id="email-address"
                        placeholder="you@example.com"
                        value={user.email ?? ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <Label
                      htmlFor="username"
                      className="text-foreground mb-3 block text-sm font-medium"
                    >
                      Username
                    </Label>
                    <Input
                      type="text"
                      name="username"
                      id="username"
                      placeholder="username"
                      defaultValue={user.username ?? ""}
                    />
                  </div>

                  {success && (
                    <div className="mb-4 p-3 rounded bg-green-500/10 border border-green-500/30 text-green-500 text-sm">
                      Profile updated successfully.
                    </div>
                  )}

                  {error && (
                    <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="gap-4.5 flex justify-end">
                    <Button variant="outline" type="button" onClick={() => window.location.reload()}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving…" : "Save"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <form action="#">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-[var(--surface-raised)] flex items-center justify-center">
                      <User className="h-8 w-8 text-[var(--text-secondary)]" />
                    </div>
                    <div>
                      <span className="text-foreground mb-1.5 block">
                        Edit your photo
                      </span>
                      <span className="flex gap-2.5">
                        <button className="hover:text-primary text-sm" type="button">
                          Delete
                        </button>
                        <button className="hover:text-primary text-sm" type="button">
                          Update
                        </button>
                      </span>
                    </div>
                  </div>

                  <div
                    id="FileUpload"
                    className="mb-5.5 border-primary bg-background sm:py-7.5 relative block w-full cursor-pointer appearance-none rounded border-2 border-dashed px-4 py-4"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-hidden"
                    />
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <span className="border-border bg-background flex h-10 w-10 items-center justify-center rounded-full border">
                        <Upload className="text-primary h-4 w-4" />
                      </span>
                      <p>
                        <span className="text-primary">Click to upload</span> or
                        drag and drop
                      </p>
                      <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                      <p>(max, 800 X 800px)</p>
                    </div>
                  </div>

                  <div className="gap-4.5 flex justify-end">
                    <Button variant="outline" type="button" onClick={() => window.location.reload()}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default SettingsPage;
