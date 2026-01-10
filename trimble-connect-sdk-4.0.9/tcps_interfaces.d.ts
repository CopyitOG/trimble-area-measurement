export declare type FileParentType = 'FOLDER' | 'TODO' | 'COMMENT' | 'OBJECTLINK';
export declare type LinkTargetType = 'FILE' | 'TODO' | 'VIEW' | 'CLASH' | 'URL';
export declare type LinksByTargetType = 'FILE' | 'FOLDER' | 'TODO' | 'URL';
export declare type ServiceApi = 'modelApi' | 'objectsSyncApi' | 'orgApi' | 'projectsApi' | 'psetApi' | 'tcApi' | 'topicApi' | 'userApi' | 'wopiApi';
export interface ConnectObject {
    /** The object origin server. */
    origin: string;
}
export interface SearchOptions {
    /** The search query. */
    query: string;
    /** Comma separated project identifiers to scope search (example: 'lj3cOiJFBGg, lj4cOiJFBGt'). */
    projectId?: string;
    /** Comma separated objects type to search by (example: 'PROJECT, FOLDER, FILE, TODO, RELEASE, VIEW, CLASH'). */
    type?: string;
    /** Start date to filter by (example: '2015-05-21T23:20:39-0000'). */
    startDate?: string;
    /** End date to filter by (example: '2015-05-21T23:20:39-0000'). */
    endDate?: string;
    /** Sort option. Valid options are: 'name' | 'modified' | 'created' | 'type'. Prefix with '+' or '-' for ascending or descending order. */
    sort?: string;
    /** Range of search results (by default will return the first 25 items). */
    range?: {
        start: number;
        end: number;
    };
}
export declare type SearchResultDetailType = View | ToDo | Project | FolderEntry | FileEntry | Clash | Release;
export interface SearchResult {
    type: string;
    details: SearchResultDetailType;
}
export interface Release extends ConnectObject {
    id: string;
    name: string;
    status: string;
    projectId?: string;
    dueDate: string;
    notes: string;
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
}
export interface Server extends ConnectObject {
    isMaster?: boolean;
    location?: string;
    awsRegion?: string;
    /** variant of location that can be used to match responses of Ecom service */
    serviceRegion?: string;
    tcApi: string;
    orgApi: string;
    psetApi: string;
    projectsApi: string;
    modelApi?: string;
    objectsSyncApi?: string;
    wopiApi?: string;
    batchApi?: string;
    userApi?: string;
    topicApi?: string;
    bbox?: number[];
}
export declare class ServerReviver implements Server {
    private readonly obj;
    constructor(obj: Server);
    get ['origin'](): string;
    get ['isMaster'](): boolean | undefined;
    get ['location'](): string | undefined;
    get ['awsRegion'](): string | undefined;
    get ['serviceRegion'](): string | undefined;
    get ['tcApi'](): any;
    get ['objectsSyncApi'](): any;
    get ['orgApi'](): any;
    get ['psetApi'](): any;
    get ['projectsApi'](): any;
    get ['wopiApi'](): any;
    get ['batchApi'](): any;
    get ['userApi'](): any;
    get ['topicApi'](): any;
    get ['modelApi'](): any;
    get ['bbox'](): any;
}
export interface FileSystemEntry extends ConnectObject {
    id: string;
    name: string;
    type: 'FILE' | 'FOLDER';
    versionId?: string;
    parentId?: string;
    parentType?: 'FOLDER' | 'TODO';
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
    deletedOn?: string;
    deletedBy?: User;
    size?: number;
    projectId?: string;
    hidden?: boolean;
    path?: {
        id: string;
        name: string;
        versionId?: string;
    }[];
}
export declare type FileEntryStatus = 'PENDING' | 'ON HOLD' | 'DONE' | 'CANCELLED' | 'ERROR' | 'PROCESSING';
export declare type FileEntryRuntimeType = 'POTREE' | 'TRIMBIM' | 'PDF';
export interface FileEntry extends FileSystemEntry {
    hash?: string;
    checkedOutOn?: string;
    checkedOutBy?: User;
    thumbnailUrl?: string[];
    revision?: number;
    status?: FileEntryStatus;
    runtimeType?: FileEntryRuntimeType;
    runtimeId?: string;
    permission?: 'READ' | 'FULL_ACCESS';
}
export interface ObjSyncAPIFileSystemEntry {
    id?: string;
    hash?: string;
    name?: string;
    size?: number;
    readOnly?: boolean;
    fileId?: string;
    directory?: boolean;
    parentId?: string;
    activeParentId?: string;
    path?: string;
    rank?: number;
    syncType?: string;
    syncFiles?: boolean;
    syncSessionId?: string;
    createdBy?: User;
    createdOn?: string;
    modifiedOn?: string;
    modifiedBy?: User;
    deletedOn?: string;
    deletedBy?: User;
}
export declare type ObjSyncType = 'ALIGNMENT' | 'CLASH' | 'COMMENT' | 'GROUP' | 'FILE' | 'FOLDER' | 'FSOBJECT' | 'OBJECTLINK' | 'RELEASE' | 'TAG' | 'TODO' | 'USER' | 'VIEW' | 'VIEWGROUP';
export declare type ObjSyncResultType = Placement[] | Clash[] | Comment[] | User[] | UserGroup[] | FileEntry[] | FolderEntry[] | FSObject[] | ObjSyncAPIFileSystemEntry[] | ObjectLink[] | Release[] | Tag[] | ToDo[] | User[] | View[] | ViewGroup[];
export interface ObjSyncAPIResponse {
    type: ObjSyncType;
    status: string;
    objects: ObjSyncResultType;
}
export interface UpdateFileEntryRequest {
    id: string;
    name?: string;
    parentId?: string;
    processingNofitySet?: boolean;
}
export interface Files {
    [modelId: string]: FileEntry;
}
export interface FolderEntry extends FileSystemEntry {
    hasChildren?: boolean;
    permission?: 'READ' | 'FULL_ACCESS';
}
export interface Folders {
    [filelId: string]: FolderEntry;
}
export interface FSObject {
    id: string;
    vid?: string;
    nm?: string;
    pid?: string;
    ptp?: string;
    tp?: string;
    mt?: number;
    mid?: string;
    cid?: string;
    ct?: number;
    did?: string;
    dt?: number;
    sz?: number;
    tn?: string;
    md5?: string;
    tc?: number;
    rv?: number;
}
export interface Project extends ConnectObject {
    id: string;
    name: string;
    rootId: string;
    thumbnail?: string;
    location?: string;
    lastVisitedOn?: string;
    modifiedOn?: string;
    createdOn?: string;
    createdBy?: User;
    modifiedBy?: User;
    updatedOn?: string;
    updatedBy?: User;
    size?: number;
    filesCount?: number;
    foldersCount?: number;
    versionsCount?: number;
    usersCount?: number;
    description?: string;
    license?: {
        id?: string;
        usedInvites?: number;
    };
    access?: 'FULL_ACCESS' | 'NO_ACCESS';
}
export declare type UserStatus = 'ACTIVE' | 'PENDING' | 'REMOVED';
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: UserStatus;
}
export interface UserDetails extends User {
    company: {
        id: string;
        name: string;
        website: string;
        image: string;
    };
    companyAdmin: boolean;
    language: string;
    createdOn: string;
    modifiedOn: string;
    podLocation: string;
    thumbnail: string;
    timeZone: string;
    title: string;
    role?: string;
    tiduuid: string;
    viewerBackground: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}
export interface UserGroup {
    id: string;
    name: string;
    projectId: string;
    createdBy: User;
    modifiedBy: User;
    createdOn: string;
    modifiedOn: string;
    usersCount: number;
}
export interface UserProjectDetails {
    id: string;
    role: string;
    groups: {
        id: string;
    }[];
}
export interface Placement {
    id?: string;
    locationX?: number;
    locationY?: number;
    locationZ?: number;
    axisX?: number;
    axisY?: number;
    axisZ?: number;
    refDirectionX?: number;
    refDirectionY?: number;
    refDirectionZ?: number;
    scale?: number;
    versionId?: string;
    fileId?: string;
    createdOn?: string;
    modifiedOn?: string;
    createdBy?: User;
    modifiedBy?: User;
}
export interface Camera {
    cameraId?: string;
    targetX?: number;
    targetY?: number;
    targetZ?: number;
    upX?: number;
    upY?: number;
    upZ?: number;
    distance?: number;
    pitch?: number;
    yaw?: number;
    projectionType?: 'ortho' | 'perspective';
    viewAngle: number;
    viewScale: number;
    viewId?: string;
}
export interface Element {
    isRecursive?: boolean;
    priority?: number;
    sourceId?: string;
    state?: ViewEntityStates;
    versionId?: string;
    color?: Color;
}
export interface ElementType {
    type?: string;
    state?: number;
    priority?: number;
    color?: Color;
}
export interface Presentation {
    ghost?: boolean;
    transparent?: boolean;
    wireframe?: boolean;
    transparencyLevel?: number;
    isNewEnabled?: boolean;
    isPendingEnabled?: boolean;
    isCriticalEnabled?: boolean;
    isResolvedEnabled?: boolean;
    isIgnoredEnabled?: boolean;
    isNotesEnabled?: boolean;
    isDocumentsEnabled?: boolean;
    elementTypes?: ElementType[];
    elements?: Element[];
}
export interface SectionPlane {
    sectionPlaneId?: string;
    directionX?: number;
    directionY?: number;
    directionZ?: number;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    viewId?: string;
    createdOn?: string;
    modifiedOn?: string;
    createdBy?: User;
    modifiedBy?: User;
}
export interface SectionBox {
    positionX: number;
    positionY: number;
    positionZ: number;
    sizeX: number;
    sizeY: number;
    sizeZ: number;
    rotationX: number;
    rotationY: number;
    rotationZ: number;
    rotationW: number;
}
export interface Color {
    r?: number;
    g?: number;
    b?: number;
    a?: number;
}
export interface Line {
    id?: string;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    position2X?: number;
    position2Y?: number;
    position2Z?: number;
    deleted?: boolean;
}
export declare type MeasurementPickType = 'point' | 'line' | 'lineSegment' | 'plane';
export interface MeasurementPick {
    type?: MeasurementPickType;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    position2X?: number;
    position2Y?: number;
    position2Z?: number;
    directionX?: number;
    directionY?: number;
    directionZ?: number;
    referenceObject?: string;
}
export declare type MarkupType = 'measure' | 'measure_with_pick' | 'measure_slope' | 'text' | 'arrow' | 'line' | 'cloud' | 'redlines' | 'angle';
export interface Markup {
    markupId?: string;
    projectId?: string;
    mashupId?: string;
    createdOn?: string;
    modifiedOn?: string;
    createdBy?: User;
    modifiedBy?: User;
    type?: MarkupType;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    color?: Color;
    planeA?: number;
    planeB?: number;
    planeC?: number;
    planeD?: number;
    width?: number;
    height?: number;
    position2X?: number;
    position2Y?: number;
    position2Z?: number;
    screenSpaceDistance?: number;
    text?: string;
    camera?: Camera;
    lines?: Line[];
    unitType?: 'Metric';
    quantityUnit?: 'millimeter';
    quantityUnitFormat?: 'mm';
    referenceObject?: string;
    start?: MeasurementPick;
    end?: MeasurementPick;
    slopeDisplayType?: 'ratio' | 'percent';
    slopeDisplayMode?: 'slopeOnly' | 'verticalAndHorizontal';
    slopePrecision?: number;
    lineOrthoMode?: 'lineOrthoOff' | 'lineOrthoPreferStart' | 'lineOrthoPreferEnd';
}
export declare type ToDoStatus = 'NEW' | 'IN_PROGRESS' | 'BLOCKED' | 'RESOLVED' | 'CLOSED';
export declare type ToDoPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export interface ToDo extends ConnectObject {
    id?: string;
    label?: string;
    type?: string;
    title?: string;
    description?: string;
    dueDate?: string;
    percentComplete?: number;
    status?: ToDoStatus;
    priority?: ToDoPriority;
    projectId?: string;
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
    assignees?: (User | UserGroup)[];
}
export declare type CommentObjectType = 'FILE' | 'FOLDER' | 'VIEW' | 'CLASH' | 'RELEASE' | 'TODO';
export interface CreateCommentRequest {
    description: string;
    objectId: string;
    objectType: CommentObjectType;
}
export interface Comment extends ConnectObject {
    id?: string;
    description?: string;
    objectId?: string;
    objectType?: CommentObjectType;
    createdOn?: string;
    createdBy?: User;
}
export declare type AttachmentType = 'VIEW' | 'FILE' | 'CLASHSET' | 'CLASHITEM' | 'VIEW2D' | 'URL';
export interface Attachment extends ConnectObject {
    id?: string;
    name?: string;
    type?: AttachmentType;
    versionId?: string;
    modifiedOn?: string;
    modifiedBy?: User;
    revision?: number;
    url?: string;
    urlName?: string;
    embedded?: boolean;
}
export interface AttachmentTarget {
    id: string;
    type: 'TODO' | 'COMMENT';
}
export interface AttachmentObject {
    id?: string;
    type: AttachmentType;
    embedded?: boolean;
    url?: string;
    urlName?: string;
}
export declare type ClashType = 'CLASH' | 'CLEARANCE';
export interface ClashSet extends ConnectObject {
    id?: string;
    name: string;
    type: ClashType;
    projectId?: string;
    count?: number;
    status?: number;
    clearance?: number;
    tolerance?: number;
    ignoreSameDiscipline: boolean;
    ignoreSameFile: boolean;
    models: string[];
    assignees?: (User | UserGroup)[];
    files?: string[];
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
    versionId?: string;
    progressDetails?: {
        statusCode: number;
        statusMessage: string;
    };
}
export interface ClashSource {
    sourceId?: string;
    versionId?: string;
}
export interface Clash extends ConnectObject {
    id?: string;
    label?: string;
    name?: string;
    type?: string;
    distance?: number;
    sourceId1?: ClashSource;
    sourceId2?: ClashSource;
    element1Uuid?: string;
    element2Uuid?: string;
    elementName1?: string;
    elementName2?: string;
    elementType1?: string;
    elementType2?: string;
    clashGeometry?: string;
    center?: {
        x: number;
        y: number;
        z: number;
    };
    modifiedOn?: string;
    modifiedBy?: User;
}
export interface ViewBase extends ConnectObject {
    id?: string;
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
    name?: string;
    description?: string;
    projectId?: string;
    thumbnail?: string;
    imageData?: string;
    assignees?: (User | UserGroup)[];
    todoId?: string;
    topicId?: string;
}
export interface View extends ViewBase {
    models?: string[];
    files?: string[];
    camera?: Camera;
    sectionPlanes?: SectionPlane[];
    sectionBox?: SectionBox;
    markups?: Markup[];
    presentation?: Presentation;
}
export interface View2D extends ViewBase {
    fileId?: string;
    versionId?: string;
    rotation?: number;
    zoomLevel?: number;
    pageNumber?: number;
    panPositionX?: number;
    panPositionY?: number;
    markup?: {
        xfdfData?: string;
    };
}
export interface ViewGroup extends ConnectObject {
    id?: string;
    projectId?: string;
    name?: string;
    views?: string[];
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
}
export declare enum ViewEntityStates {
    Selected = 1,
    Hidden = 4,
    SelectedHidden = 5,
    Visible = 6,
    SelectedVisible = 7,
    Highlighted = 8
}
export declare type ShareMode = 'PROJECT_USERS' | 'REGISTERED_USERS' | 'PUBLIC';
export declare type SharePermission = 'VIEW' | 'DOWNLOAD';
export interface ShareObject {
    id: string;
    type: 'FILE';
    url: string;
    useLatestVersion: true;
}
export interface Share extends ConnectObject {
    accessToken?: string;
    createdBy?: User;
    createdOn?: string;
    expiryDate?: string | 'never';
    id?: string;
    mode?: ShareMode;
    modifiedBy?: User;
    modifiedOn?: string;
    objects?: ShareObject[];
    permission?: SharePermission;
    projectId?: string;
}
export interface Tag extends ConnectObject {
    id?: string;
    label?: string;
    description?: string;
    projectId?: string;
    createdOn?: string;
    createdBy?: User;
    modifiedOn?: string;
    modifiedBy?: User;
}
export declare type TagObjectType = 'FOLDER' | 'FILE' | 'TODO' | 'VIEW';
export interface ObjectLink {
    fileId: string;
    versionId: string;
    objectId: string;
    targetId: string;
    targetType: string;
}
export interface LinkData {
    type?: string;
    objectId?: string;
    sourceId?: string;
    xrefId?: string;
}
export interface LinkSource {
    id?: string;
    versionId?: string;
    type?: string;
    data?: LinkData[];
}
export interface LinkTarget {
    type?: string;
    name?: string;
    id?: string;
    versionId?: string;
}
export interface Link {
    id?: string;
    name?: string;
    modifiedBy?: User;
    createdBy?: User;
    createdOn?: string;
    modifiedOn?: string;
    source?: LinkSource;
    target?: LinkTarget;
}
export interface UnitSettings {
    unitsystem: string;
    lengthunit: string;
    lengthunitformat: string;
    lengthmeasurementunit: string;
    lengthmeasurementunitformat: string;
    areaunit: string;
    areaunitformat: string;
    volumeunit: string;
    volumeunitformat: string;
    weightunit: string;
    weightunitformat: string;
    angularunit: string;
    angularunitformat: string;
}
export interface ProjectSettings {
    unitSettings?: UnitSettings;
    isTodosRestricted?: boolean;
    isProjectInviteRestricted?: boolean;
}
export interface UrlResponse {
    url: string;
}
export interface InitUploadResponse {
    uploadId: string;
    uploadURL: string;
}
export interface StatusResponse {
    status: number;
}
export interface SyncStatusResponse {
    status?: string;
    projectId?: 'string';
    modifiedOn?: 'string';
    projectMetadataTs?: 'string';
    teamTs?: 'string';
    groupsTs?: 'string';
    fsobjTs?: 'string';
    alignmentTs?: 'string';
    thumbnailTs?: 'string';
    permissionsTs?: 'string';
    commentsTs?: 'string';
    tagTs?: 'string';
    todosTs?: 'string';
    releasesTs?: 'string';
    clashesTs?: 'string';
    viewsTs?: 'string';
    views2dTs?: 'string';
    viewGroupsTs?: 'string';
    objectlinkTs?: 'string';
}
