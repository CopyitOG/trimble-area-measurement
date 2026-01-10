import { Configuration } from './config';
import { ServiceResponse } from './response';
import { Service } from './service';
import { Attachment, AttachmentObject, AttachmentTarget, Clash, ClashSet, ConnectObject, Comment, CommentObjectType, CreateCommentRequest, FileEntry, FileParentType, FolderEntry, Link, LinksByTargetType, LinkTargetType, Placement, Project, ProjectSettings, ObjSyncAPIFileSystemEntry, ObjSyncAPIResponse, SearchOptions, SearchResult, Server, ServiceApi, Share, StatusResponse, SyncStatusResponse, Tag, TagObjectType, ToDo, UpdateFileEntryRequest, UrlResponse, User, UserDetails, UserGroup, UserProjectDetails, View, View2D, ViewGroup } from './tcps_interfaces';
/** The production TCPS service url. */
export declare const DefaultTCPSServiceUri = "https://app.connect.trimble.com/tc/api/2.0/";
/**
 * The service client that represents connection to the TCPS (Trimble Connect Platform Services).
 * Each API operation is exposed as a function on service.
 */
export declare class TCPS extends Service {
    /**
     * Determines whether the item is a file.
     * @param item The folder item.
     */
    static isFile(item: FileEntry | FolderEntry): item is FileEntry;
    /**
     * Determines whether the item is a folder.
     * @param item The folder item.
     */
    static isFolder(item: FileEntry | FolderEntry): item is FolderEntry;
    /**
     * Converts aws region name to service uri. Can be called without credentials.
     * @param region The region name.
     * @param serviceApi The service api name.
     * @returns
     */
    static regionToServiceUri(region: string, serviceApi: ServiceApi): Promise<string | undefined>;
    /**
     * Formats the TCPS POD url from the "origin".
     * @param origin The origin.
     * @param path The relative path.
     */
    private static formatUrlFromOrigin;
    /**
     * @constructor Constructs a service object.
     * @param {Config} config The configuration options (e.g. service url). If not provided the default configuration will be used.
     * @param {Credentials} credentials The credentials to be attached to service requests.
     */
    constructor(config?: Partial<Configuration>);
    /**
     * Search entities.
     * @param origin The origin.
     * @param searchOptions The search options.
     */
    search(origin: string, searchOptions: SearchOptions): Promise<ServiceResponse<SearchResult[]>>;
    /**
     * Returns a list of regional pods with the mapping from the project location to sevice endpoints that should be used for storing project data.
     * @returns {Promise<ServiceResponse<Server>>} the list of regional pods.
     */
    listServers(): Promise<ServiceResponse<Server[]>>;
    /**
     * Returns the user details.
     * @param userId The user identifier.
     */
    getUserDetails(userId: string): Promise<ServiceResponse<UserDetails>>;
    /**
     * Returns the available projects on a server.
     * @param server The server.
     */
    listProjects(server: ConnectObject): Promise<ServiceResponse<Project[]>>;
    /**
     * Returns the project by it's identifier
     * @param id The project identifier
     * @param server The server (optional)
     */
    getProject(id: string, server?: ConnectObject): Promise<ServiceResponse<Project>>;
    /**
     * Return updated project after patch.
     * @param {string} projectId project's id.
     * @param {string} projectOrigin project's origin uri.
     * @param {Partial<Project>} patchObject Object with key:value pair.
     * @returns {Promise<ServiceResponse<Project>>} Service response.
     */
    patchProject(projectId: string, projectOrigin: string, patchObject: Partial<Project>): Promise<ServiceResponse<Project>>;
    /**
     * Return updated project after patch.
     * @param {project} project.
     * @returns {Promise<ServiceResponse<Project>>} Service response.
     */
    updateLastVisitedOnProject(project: Project): Promise<ServiceResponse<Project>>;
    /**
     * Returns the project members by project identifier
     * @param project The project
     */
    listProjectMembers(project: Project): Promise<ServiceResponse<UserDetails[]>>;
    /**
     * Returns the folder and file structure of a project.
     * @param project The Project.
     * @returns {Promise<ServiceResponse<ObjSyncAPIFileSystemEntry[]>>} Service response containing the list of ObjSyncAPIFileSystemEntry.
     */
    listProjectFileSystemStructure(project: Project): Promise<ServiceResponse<ObjSyncAPIFileSystemEntry[]>>;
    /**
     * Creates new user group
     * @param {Project} project The project.
     * @param {string} name The project name.
     * @returns {Promise<ServiceResponse<UserGroup>>} Service response containing the created group.
     */
    createUserGroup(project: Project, name: string): Promise<ServiceResponse<UserGroup>>;
    /**
     * Removes give user group.
     * @param {Project} project The project.
     * @param {string} groupId The group id.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    removeUserGroup(project: Project, groupId: string): Promise<ServiceResponse<void>>;
    /**
     * Returns list of user groups.
     * @param {Project} project The project.
     * @returns {Promise<ServiceResponse<UserGroup[]>>} Service response containing user groups.
     */
    listUserGroups(project: Project): Promise<ServiceResponse<UserGroup[]>>;
    /**
     * Returns list of users in the given group.
     * @param {Project} project The project.
     * @param {string} groupId The group id.
     * @returns {Promise<ServiceResponse<User[]>>} Service response containing list of users.
     */
    listUsersInGroup(project: Project, groupId: string): Promise<ServiceResponse<User[]>>;
    /**
     * Adds users to the given group.
     * @param {Project} project The project.
     * @param {string} groupId The group id.
     * @param {string[]} userIds The list of user ids to add to the given group.
     * @returns {Promise<ServiceResponse<User[]>>} Service response containing added users.
     */
    addUsersToGroup(project: Project, groupId: string, userIds: string[]): Promise<ServiceResponse<User[]>>;
    /**
     * Removes users from the given group.
     * @param {Project} project The project.
     * @param {string} groupId The group id.
     * @param {string[]} userIds The list of user ids to remove from the given group.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    removeUsersFromGroup(project: Project, groupId: string, userIds: string[]): Promise<ServiceResponse<void>>;
    /**
     * Returns the project details of logged-in user.
     * @param origin The origin. (optional)
     * @returns {Promise<ServiceResponse<UserProjectDetails>>} Service response.
     */
    getUserProjectDetails(origin: string): Promise<ServiceResponse<UserProjectDetails[]>>;
    /**
     * Invite a user to project.
     * @param {Project} project The project.
     * @param {string} userEmail The user email.
     * @param {string} userRole The user role.
     * @returns {Promise<ServiceResponse<UserDetails>>} Service response.
     */
    inviteUserToProject(project: Project, userEmail: string, userRole: string): Promise<ServiceResponse<UserDetails>>;
    /**
     * Get a user details from project.
     * @param {Project} project The project.
     * @param {string} userId The user Id.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    getUserFromProject(project: Project, userId: string): Promise<ServiceResponse<UserDetails>>;
    /**
     * Remove a user from project.
     * @param {string} project The project details from which user has to be removed.
     * @param {string} userId The user Id.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    removeUserFromProject(project: Project, userId: string): Promise<ServiceResponse<void>>;
    /**
     * List of users for the company id
     * @param {string} origin regions location of the projects
     * @param {string} companyId Company's id
     * @returns {Promise<ServiceResponse<User[]>>} Service response containing list of users.
     */
    listUsersByCompanyId(origin: string, companyId: string): Promise<ServiceResponse<User[]>>;
    /**
     * Get project settings.
     * @param {Project} project The project.
     * @returns {Promise<ServiceResponse<ProjectSettings>>} Service response containing project settings.
     */
    getProjectSettings(project: Project): Promise<ServiceResponse<ProjectSettings>>;
    /**
     * Put project settings.
     * @param {Project} project The project.
     * @param {ProjectSettings} projectSettings The project settings.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    putProjectSettings(project: Project, projectSettings: ProjectSettings): Promise<ServiceResponse<void>>;
    /**
     * Returns the folder items.
     * @param folderId The folder id.
     */
    listFolderEntries(parent: Project | FolderEntry): Promise<ServiceResponse<(FileEntry | FolderEntry)[]>>;
    /**
     * Returns the format processing status for given file.
     * @param {Project} project The Project.
     * @param {string} fileId The file id.
     * @param {string} versionId Optional version identifier.
     * @param {string} format Optional file format.
     * @returns {Promise<ServiceResponse<StatusResponse>>} The valid return value s are integer from 0 to 100, negative values indicate processing error.
     */
    getFileStatus(project: Project, fileId: string, versionId?: string, format?: string): Promise<ServiceResponse<StatusResponse>>;
    /**
     * Returns the sync api status for given project.
     * @param {string} project The Project.
     * @returns {Promise<ServiceResponse<string>>} String value representing the sync api status for the project.
     */
    getProjectSyncStatus(project: Project, encode?: boolean): Promise<ServiceResponse<SyncStatusResponse>>;
    /**
     * Returns the sync api objects for given project with given status.
     * @param {Project} project The Project.
     * @param {string} status The sync status indicator.
     * @returns {Promise<ServiceResponse<ObjSyncAPIResponse>>} Response containing sync api object list.
     */
    getProjectSyncObjects(project: Project, status: string, types?: string, combineStreams?: boolean): Promise<ServiceResponse<ObjSyncAPIResponse[]>>;
    /**
     * Returns the file.
     * @param project The Project.
     * @param fileId The file id.
     * @param {string} versionId Optional version identifier.
     */
    getFile(project: Project, fileId: string, versionId?: string): Promise<ServiceResponse<FileEntry>>;
    /**
     * Returns the file versions.
     * @param project The Project.
     * @param fileId The file id.
     * @returns {Promise<ServiceResponse<FileEntry[]>>} Service response.
     */
    getFileVersions(project: Project, fileId: string): Promise<ServiceResponse<FileEntry[]>>;
    /**
     * Returns the file versions page by page.
     * @param {Project} project The project.
     * @param {string} fileId The file id.
     * @param {(response: ServiceResponse<FileEntry[]>) => void} onPageRetrieved The callback which returns results for each page.
     * @param {number} pageSize The page size used to request items.
     * @returns {Promise<void>} Service response.
     */
    getFileVersionsWithPages(project: Project, fileId: string, onPageRetrieved: (response: ServiceResponse<FileEntry[]>) => void, pageSize?: number): Promise<void>;
    /**
     * Updates the file. Renaming, moving, and setting assimilation notification supported.
     * @param {Project} project The Project.
     * @param {UpdateFileEntryRequest} updateRequest The update request.
     * @returns {Promise<ServiceResponse<FileEntry>>} Service response containing udpate file entry.
     */
    updateFile(project: Project, updateRequest: UpdateFileEntryRequest): Promise<ServiceResponse<FileEntry>>;
    /**
     * Returns the folder.
     * @param project The Project.
     * @param folderId The folder id.
     */
    getFolder(project: Project, folderId: string): Promise<ServiceResponse<FolderEntry>>;
    /**
     * Returns the file download url application can use to download file content.
     * @param {FileEntry} file The file.
     * @param {string} versionId Optional version identifier.
     * @param {string} format Optional format.
     * @returns {ServiceResponse<void>} Service response.
     */
    getFileDownloadUrl(file: FileEntry, versionId?: string, format?: string): Promise<ServiceResponse<UrlResponse>>;
    /**
     * Uploads the given files.
     * @param {Project} The project
     * @param {File[]} files The files to upload.
     * @param {string} parentId The parent identifier.
     * @param {FileParentType} parentType The parent type.
     * @returns {Array<ServiceResponse<FileEntry>>} Array of service responses containing created file entries.
     */
    uploadFileContent(project: Project, files: File[], parentId: string, parentType: FileParentType): Promise<ServiceResponse<FileEntry>[]>;
    /**
     * Makes an attempt to process or reprocess the given file.
     * @param {Project} The project
     * @param {FileEntry} file The file entry.
     * @param {string} format Accepted values: "TRB" or "BSQ", default is "TRB".
     * @returns {ServiceResponse<void>} The service response.
     */
    assimilateFile(project: Project, file: FileEntry, format?: 'TRB' | 'BSQ'): Promise<ServiceResponse<void>>;
    /**
     * Uploads the presentation file content connected to the parent file.
     * @param file The file.
     * @param parent The parent file.
     * @param format The file's format.
     * @param parentVersionId The parent file version id.
     */
    putPresentationFileContent(file: File, parent: FileEntry, format: string, parentVersionId?: string): Promise<ServiceResponse<void>>;
    /**
     * Gets an image URL.
     * @param source The source object.
     * @param path The image path.
     */
    getImage(source: ConnectObject | undefined, path: string): Promise<string>;
    /**
     * Returns the model placement information.
     * @param file The model file.
     * @param versionId (optional) The model's version identifier to return its placement data.
     */
    getPlacement(file: FileEntry, versionId?: string): Promise<ServiceResponse<Placement>>;
    /**
     * Create or update model placement for a given file.
     * @param file The model file.
     * @param placement The alignment.
     * @param versionId (optional) The model's version identifier to link the given placement data to.
     */
    putPlacement(file: FileEntry, placement: Placement, versionId?: string): Promise<ServiceResponse<Placement>>;
    /**
     * Returns the todos.
     * @param project The project.
     */
    listToDos(project: Project): Promise<ServiceResponse<ToDo[]>>;
    /**
     * Returns the todo.
     * @param project The project.
     * @param todoId The project.
     */
    getToDo(project: Project, todoId: string): Promise<ServiceResponse<ToDo>>;
    /**
     * Creates a new todo and returns it.
     * @param project The project.
     * @param todo The todo data.
     */
    createToDo(project: Project, todo: ToDo): Promise<ServiceResponse<ToDo>>;
    /**
     * Updates the todo.
     * @param {Project} project The project.
     * @param {ToDo} todo The updated todo data.
     * @returns {Promise<ServiceResponse<ToDo>>} Service response containing updated todo.
     */
    updateToDo(project: Project, todo: ToDo): Promise<ServiceResponse<ToDo>>;
    /**
     * Removes the todo.
     * @param project The project.
     * @param todoId The todo identifier.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    removeToDo(project: Project, todoId: string): Promise<ServiceResponse<void>>;
    /**
     * Returns the todo comments.
     * @param todo The todo.
     */
    listToDoComments(todo: ToDo): Promise<ServiceResponse<Comment[]>>;
    /**
     * Returns comments related to the given entity.
     * @param {Project} project The project.
     * @param {string} entityId The entity identifier.
     * @param {CommentObjectType} entityType The entity type.
     */
    listComments(project: Project, entityId: string, entityType: CommentObjectType): Promise<ServiceResponse<Comment[]>>;
    /**
     * Returns the attachements.
     * @param origin The origin.
     * @param projectId The project id.
     * @param entityId The entity id.
     * @param entityType The entity type. Supported types are "TODO" and "COMMENT".
     */
    listAttachments(origin: string, projectId: string, entityId: string, entityType: 'TODO' | 'COMMENT'): Promise<ServiceResponse<Attachment[]>>;
    /**
     * Returns the todo attachments.
     * @param todo The todo.
     */
    listToDoAttachments(todo: ToDo): Promise<ServiceResponse<Attachment[]>>;
    /**
     * Adds attachments to entity.
     * @param origin The origin.
     * @param projectId The project id.
     * @param entity The target entity.
     * @param attachments An array of entity details to attach.
     */
    addAttachmentsToEntity(origin: string, projectId: string, entity: AttachmentTarget, attachments: AttachmentObject[]): Promise<ServiceResponse<Attachment>>;
    /**
     * Attaches a view to todo.
     * @param todo The todo.
     * @param view The view.
     */
    attachViewToTodo(todo: ToDo, view: View): Promise<ServiceResponse<Attachment>>;
    /**
     * Remove attachment from entity.
     * @param origin The origin.
     * @param projectId The project id.
     * @param entityId The target entity.
     * @param entityType The target type.
     * @param attachmentId The attachment id.
     * @param attachmentType The type of the attached entity.
     */
    removeAttachment(origin: string, projectId: string, entityId: string, entityType: string, attachmentId: string, attachmentType: string): Promise<ServiceResponse<void>>;
    /**
     * Creates a comment.
     * @param {Project} project The project.
     * @param {CreateCommentRequest} comment The comment data.
     */
    createComment(project: Project, comment: CreateCommentRequest): Promise<ServiceResponse<Comment>>;
    /**
     * Updates a comment.
     * @param {Comment} comment The comment data.
     * @returns {Promise<ServiceResponse<Comment>>} Service response containing udpated comment.
     */
    updateComment(comment: Comment): Promise<ServiceResponse<Comment>>;
    /**
     * Deletes a comment.
     * @param project The project.
     * @param commentId The comment identifier.
     */
    deleteComment(project: Project, commentId: string): Promise<ServiceResponse<void>>;
    /**
     * Returns a list of 2D views.
     * @param project The project.
     * @returns {Promise<ServiceResponse<View2D[]>>} Service response containing a list of 2D views.
     */
    list2DViews(project: Project): Promise<ServiceResponse<View2D[]>>;
    /**
     * Returns a 2D view.
     * @param project The project.
     * @param viewId The view id.
     * @returns {Promise<ServiceResponse<View2D>>} Service response containing the 2D view data.
     */
    get2DView(project: Project, viewId: string): Promise<ServiceResponse<View2D>>;
    /**
     * Creates a new 2D view.
     * @param project The project.
     * @param view The view data.
     * @returns {Promise<ServiceResponse<View2D>>} Service response containing the created 2D view data.
     */
    create2DView(project: Project, view: View2D): Promise<ServiceResponse<View2D>>;
    /**
     * Updates the 2D view.
     * @param {Project} project The project.
     * @param {View} view The view data.
     * @returns {Promise<ServiceResponse<View2D>>} Service response containing the updated 2D view data.
     */
    update2DView(project: Project, view: View2D): Promise<ServiceResponse<View2D>>;
    /**
     * Removes the 2D view.
     * @param project The project.
     * @param viewId The view identifier.
     * @param [force=false] Flag to delete explicit view even if it is attached to ToDos. Default is false.
     */
    remove2DView(project: Project, viewId: string, force?: boolean): Promise<ServiceResponse<void>>;
    /**
     * Returns a list of 3D views.
     * @param project The project.
     */
    listViews(project: Project): Promise<ServiceResponse<View[]>>;
    /**
     * Returns a list of 3D views.
     * @param project The project.
     * @param pageSize The page size used to request items.
     */
    listViewPaginated(project: Project, onPageRetrieved: (response: ServiceResponse<View[]>) => void, pageSize?: number): Promise<void>;
    /**
     * Returns a 3D view.
     * @param project The project.
     * @param viewId The view id.
     */
    getView(project: Project, viewId: string): Promise<ServiceResponse<View>>;
    /**
     * Creates a new 3D view.
     * @param project The project.
     * @param view The view data.
     */
    createView(project: Project, view: View): Promise<ServiceResponse<View>>;
    /**
     * Updates a 3D view.
     * @param {Project} project The project.
     * @param {View} view The view data.
     * @returns {Promise<ServiceResponse<View>>} Service response containing the updated view data.
     */
    updateView(project: Project, view: View): Promise<ServiceResponse<View>>;
    /**
     * Removes a 3D view.
     * @param project The project.
     * @param viewId The view identifier.
     * @param [force=false] Flag to delete explicit view even if it is attached to ToDos. Default is false.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    removeView(project: Project, viewId: string, force?: boolean): Promise<ServiceResponse<void>>;
    /**
     * Creates a new view group.
     * @param project The project.
     * @param name The name of the group.
     * @param views List of views to add to the group. Optional.
     * @returns {Promise<ServiceResponse<ViewGroup>>} Service response containing the created view group.
     */
    createViewGroup(project: Project, name: string, views?: string[]): Promise<ServiceResponse<ViewGroup>>;
    /**
     * Removes the view group.
     * @param project The project.
     * @param viewGroupId The view group identifier.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    removeViewGroup(project: Project, viewGroupId: string): Promise<ServiceResponse<void>>;
    /**
     * Updates the view group. Name and views modifications supported.
     * @param project The project.
     * @param viewGroup The view group.
     * @returns {Promise<ServiceResponse<ViewGroup>>} Service response.
     */
    updateViewGroup(project: Project, viewGroup: ViewGroup): Promise<ServiceResponse<ViewGroup>>;
    /**
     * Returns the view groups.
     * @param project The project.
     * @returns {Promise<ServiceResponse<ViewGroup[]>>} Service response containing view groups.
     */
    listViewGroups(project: Project): Promise<ServiceResponse<ViewGroup[]>>;
    /**
     * Returns the tags.
     * @param project The project.
     */
    listTags(project: Project): Promise<ServiceResponse<Tag[]>>;
    /**
     * Creates a new tag.
     * @param project The project.
     * @param tag The Tag.
     */
    createTag(project: Project, tag: Tag): Promise<ServiceResponse<Tag>>;
    /**
     * Adds object to a tag.
     * @param tag The Tag.
     * @param id The object id.
     * @param objectType The object type.
     */
    addObjectToTag(tag: Tag, id: string, objectType: TagObjectType): Promise<ServiceResponse<void>>;
    /**
     * Removes object from a tag.
     * @param tag The Tag.
     * @param id The object id.
     * @param objectType The object type.
     */
    removeObjectFromTag(tag: Tag, id: string, objectType: TagObjectType): Promise<ServiceResponse<void>>;
    /**
     * List tags related to an object.
     * @param project The project.
     * @param objectId The object id.
     * @param objectType The object type.
     */
    listTagsInObject(project: Project, objectId: string, objectType: TagObjectType): Promise<ServiceResponse<Tag[]>>;
    /**
     * Get links by file.
     * @param {Project} project The project.
     * @param {string} id The file id.
     * @param {string} versionId The version id. Optional.
     * @param {string} sourceId The source identifier of the object of interest. Optional.
     * @param [includeDeleted=false] Indicates whether to include deleted links. Default is 'false'
     * @param [full=false] Indicates whether to get full or mini version of listing. Default is 'false'.
     * @returns {Promise<ServiceResponse<Link[]>>} Service response containing links related to the given file.
     */
    getLinksByFile(project: Project, id: string, versionId?: string, sourceId?: string, includeDeleted?: boolean, full?: boolean): Promise<ServiceResponse<Link[]>>;
    /**
     * Get links by object.
     * @param {Project} project The project.
     * @param {string} objectId The object id.
     * @param {LinksByTargetType} objectType The object type. Supporter types are FOLDER, FILE, TODO and URL.
     * @param [includeDeleted=false] Indicates whether to include deleted links.
     */
    getLinksByEntity(project: Project, objectId: string, objectType: LinksByTargetType, includeDeleted?: boolean): Promise<ServiceResponse<Link[]>>;
    /**
     * Creates object link.
     * @param {Project} project The project.
     * @param {string} modelId The model id.
     * @param {string} versionId The fileversion id.
     * @param {string[]} objectIds The object ids.
     * @param {string} targetId The target id.
     * @param {string} targetType The target type. Supported types are file, todo, view, clash, and url.
     * @param {string} urlName The URL name (in case the target type is URL).
     * @returns {Promise<ServiceResponse<void>>} Service response containing created link.
     */
    createObjectLink(project: Project, modelId: string, versionId: string, objectIds: string[], targetId: string, targetType: LinkTargetType, urlName?: string): Promise<ServiceResponse<Link>>;
    /**
     * Updates the object link.
     * @param {Project} project The project.
     * @param {Link} link The updated object link data.
     * @returns {Promise<ServiceResponse<Link>>} Service response containing updated object link.
     */
    updateObjectLink(project: Project, link: Link): Promise<ServiceResponse<Link>>;
    /**
     * Deletes object link.
     * @param {Project} project The project.
     * @param {string} linkId The link id.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    deleteObjectLink(project: Project, linkId: string): Promise<ServiceResponse<void>>;
    /**
     * Returns clash sets of a project.
     * @param {Project} project The project.
     * @returns {Promise<ServiceResponse<ClashSet[]>>} Service response.
     */
    listClashSets(project: Project): Promise<ServiceResponse<ClashSet[]>>;
    /**
     * Returns clash set details.
     * @param {Project} project The project.
     * @param {string} clashSetId The clash set id.
     * @returns {Promise<ServiceResponse<ClashSet>>} Service response.
     */
    getClashSetDetails(project: Project, clashSetId: string): Promise<ServiceResponse<ClashSet>>;
    /**
     * Creates a new ClashSet and returns it.
     * @param {Project} project The project.
     * @param {string} clash The clash set data.
     * @returns {Promise<ServiceResponse<ClashSet>>} Service response.
     */
    createClashSet(project: Project, clashset: ClashSet): Promise<ServiceResponse<ClashSet>>;
    /**
     * Updates clash set.
     * @param {Project} project The project.
     * @param {string} clashId The clash id.
     * @returns {Promise<ServiceResponse<ClashSet>>} Service response.
     */
    updateClashSet(project: Project, clashset: ClashSet): Promise<ServiceResponse<ClashSet>>;
    /**
     * Deletes clash set.
     * @param {Project} project The project.
     * @param {string} clashSetId The clash set id.
     * @returns {Promise<ServiceResponse<void>>} Service response.
     */
    deleteClashSet(project: Project, clashSetId: string): Promise<ServiceResponse<void>>;
    /**
     * Returns clash items.
     * @param {Project} project The project.
     * @param {string} clashId The clash set id.
     * @returns {Promise<ServiceResponse<Clash[]>>} Service response.
     * @deprecated
     */
    getClashItems(project: Project, clashSetId: string): Promise<ServiceResponse<Clash[]>>;
    /**
     * Returns clash items page by page.
     * @param {Project} project The project.
     * @param {string} clashId The clash set id.
     * @param {(response: ServiceResponse<Clash[]>) => void} onPageRetrieved The callback which returns results for each page.
     * @param {number} pageSize The page size used to request items, default is 1000.
     * @returns {Promise<void>} Service response.
     */
    getClashItemsWithPages(project: Project, clashSetId: string, onPageRetrieved: (response: ServiceResponse<Clash[]>) => void, pageSize?: number): Promise<void>;
    /**
     * Returns the share.
     * @param origin The service origin.
     * @param sToken The share token.
     * @returns {Promise<ServiceResponse<Share>>} Service response.
     */
    getShare(origin: string, sToken: string): Promise<ServiceResponse<Share>>;
}
/**
 * The default instance of the TCPS client.
 */
export declare const TCPSClient: TCPS;
export default TCPSClient;
