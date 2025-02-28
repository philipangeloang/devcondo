/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { Input } from "@/app/_components/ui/input";
import { toast } from "sonner";
import { Card, CardContent } from "@/app/_components/ui/card";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/_components/ui/alert-dialog";

import Loader from "@/app/_components/blocks/loader";

const certificationSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  yearAwarded: z.string().length(4, "Year must be 4 digits"),
});

type CertificationsFormProps = {
  resumeId: number;
  addCertificationDialogOpen: boolean;
  setAddCertificationDialogOpen: (open: boolean) => void;
};

export function CertificationsForm({
  resumeId,
  addCertificationDialogOpen,
  setAddCertificationDialogOpen,
}: CertificationsFormProps) {
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [editCertificationDialogOpen, setEditCertificationDialogOpen] =
    useState<number | null>(null);
  const [editId, setEditId] = useState<number>(0);

  // TRPC Hooks
  const utils = api.useUtils();
  const {
    data: certifications,
    isLoading: isCertificationsLoading,
    isFetching: isCertificationsFetching,
  } = api.certifications.getByResumeId.useQuery(resumeId, {
    enabled: !!resumeId,
  });

  // Form hooks
  const certificationForm = useForm<z.infer<typeof certificationSchema>>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      yearAwarded: "",
    },
  });

  const updateCertificationForm = useForm<z.infer<typeof certificationSchema>>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      yearAwarded: "",
    },
  });

  // Mutations
  const { mutate: create } = api.certifications.create.useMutation({
    onSuccess: async ({ message }) => {
      await utils.certifications.invalidate();
      setAddCertificationDialogOpen(false);
      certificationForm.reset();
      setIsSaving(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      setIsSaving(false);
      toast("Error", {
        description: error.message,
      });
    },
  });

  const { mutate: update } = api.certifications.update.useMutation({
    onSuccess: async ({ message }) => {
      await utils.certifications.invalidate();
      setEditCertificationDialogOpen(null);
      updateCertificationForm.reset();
      setIsSaving(false);
      toast(message, {
        description: new Date().toLocaleTimeString(),
      });
    },
    onError: async (error) => {
      setIsSaving(false);
      toast("Error", {
        description: error.message,
      });
    },
  });

  const { mutate: deleteCertification } = api.certifications.delete.useMutation(
    {
      onSuccess: async () => {
        await utils.certifications.invalidate();
        toast("Successfully Deleted", {
          description: new Date().toLocaleTimeString(),
        });
      },
      onError: async (error) => {
        toast("Error", {
          description: error.message,
        });
      },
    },
  );

  // Form handlers
  function onSubmit(values: z.infer<typeof certificationSchema>) {
    try {
      setIsSaving(true);
      create({ ...values, resumeId });
    } catch (error) {
      console.error(error);
    }
  }

  function onUpdate(values: z.infer<typeof certificationSchema>) {
    try {
      setIsSaving(true);
      update({ ...values, id: editId });
    } catch (error) {
      console.error(error);
    }
  }

  // Reset form handlers
  useEffect(() => {
    if (editId !== null) {
      const certification = certifications?.find((p) => p.id === editId);
      if (certification) {
        updateCertificationForm.reset({
          title: certification.title,
          yearAwarded: certification.yearAwarded,
        });
      }
    }
  }, [editId, certifications, updateCertificationForm]);

  return (
    <div className="space-y-4">
      <Dialog
        open={addCertificationDialogOpen}
        onOpenChange={setAddCertificationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Certification</DialogTitle>
            <DialogDescription>
              Add your certification here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Form {...certificationForm}>
            <form
              onSubmit={certificationForm.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={certificationForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. AWS Certified Solutions Architect"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={certificationForm.control}
                name="yearAwarded"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year Awarded</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2023" maxLength={4} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Certification"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Certifications List */}
      {isCertificationsLoading || isCertificationsFetching ? (
        <Loader />
      ) : certifications?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No certifications added yet.
          </p>
        </div>
      ) : (
        certifications?.map((certification) => (
          <Card key={certification.id}>
            <CardContent className="flex items-start justify-between p-6">
              <div className="space-y-2">
                <h3 className="font-semibold">{certification.title}</h3>
                <p className="text-sm text-zinc-500">
                  Awarded in {certification.yearAwarded}
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog
                  open={editCertificationDialogOpen === certification.id}
                  onOpenChange={(open) => {
                    setEditCertificationDialogOpen(
                      open ? certification.id : null,
                    );
                    setEditId(certification.id);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      className="cursor-pointer bg-black text-white dark:bg-white dark:text-black"
                      size="icon"
                    >
                      <IconEdit />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Certification</DialogTitle>
                      <DialogDescription>
                        Edit your certification here. Click save when
                        you&apos;re done.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...updateCertificationForm}>
                      <form
                        onSubmit={updateCertificationForm.handleSubmit(
                          onUpdate,
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={updateCertificationForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. AWS Certified Solutions Architect"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={updateCertificationForm.control}
                          name="yearAwarded"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Year Awarded</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. 2023"
                                  maxLength={4}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="cursor-pointer bg-red-500 text-white dark:bg-red-500"
                      size="icon"
                    >
                      <IconTrash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this certification? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteCertification(certification.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
