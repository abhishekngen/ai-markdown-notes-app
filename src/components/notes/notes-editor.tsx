"use client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Plus, Save} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Button} from "@/components/ui/button";
import ReactMarkdown from "react-markdown"

export default function NotesEditor() {
    const activeNote = true;
    const editContent = "This is a note";
    const createNewNote = () => {};
    const saveNote = () => {};

    return (
        <Card className="h-[calc(100vh-150px)]">
            <CardHeader className="pb-3">
                <CardTitle>
                    {/*{activeNote ? (*/}
                    {/*    <Input*/}
                    {/*        value={editTitle}*/}
                    {/*        onChange={(e) => setEditTitle(e.target.value)}*/}
                    {/*        className="text-xl font-bold"*/}
                    {/*        placeholder="Note title"*/}
                    {/*    />*/}
                    {/*) : (*/}
                    {/*    "Select or create a note"*/}
                    {/*)}*/}
                    A card
                </CardTitle>
                {/*{activeNote && (*/}
                {/*    <CardDescription>Last edited: {activeNote.createdAt.toLocaleDateString()}</CardDescription>*/}
                {/*)}*/}
            </CardHeader>
            <CardContent>
                {activeNote ? (
                    <Tabs defaultValue="edit" className="h-[calc(100vh-280px)]">
                        <TabsList className="mb-2">
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="edit" className="h-full">
                            <Textarea
                                // value={editContent}
                                // onChange={(e) => setEditContent(e.target.value)}
                                placeholder="Write your markdown here..."
                                className="h-full min-h-[calc(100vh-320px)] resize-none font-mono"
                            />
                        </TabsContent>
                        <TabsContent value="preview" className="h-full">
                            <ScrollArea className="h-full min-h-[calc(100vh-320px)] border rounded-md p-4">
                                {editContent ? (
                                    <ReactMarkdown>{editContent}</ReactMarkdown>
                                ) : (
                                    <p className="text-muted-foreground">Nothing to preview</p>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="flex items-center justify-center h-[calc(100vh-280px)] border rounded-md">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">No note selected</p>
                            <Button onClick={createNewNote}>
                                <Plus className="h-4 w-4 mr-2" /> Create a new note
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            {activeNote && (
                <CardFooter>
                    <Button onClick={saveNote} className="ml-auto">
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
