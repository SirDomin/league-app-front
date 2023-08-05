export class QueueTypeTransformer {

    static queues = [
        {id: 400, name: 'Normal Draft'},
        {id: 420, name: 'Ranked Solo'},
        {id: 430, name: 'Normal Blind'},
        {id: 440, name: 'Ranked Flex'},
        {id: 450, name: 'Aram'},
        {id: 1700, name: 'Arena'},
        {id: 1900, name: 'URF'},
    ]

    static convert(queueId) {
        const queue = QueueTypeTransformer.queues.filter(queue => { return queue.id === queueId});

        return queue.length === 0 ? null : queue[0].name;
    }
}